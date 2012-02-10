import datetime
import sys
import numpy as np
import simplejson
import time
import copy
from optparse import OptionParser

from wb.weather_data.ttypes import MeasurementTypeEnum
from wb.ttypes import StationNetworkEnum
from wb.lib import services, nostralib, iterlib
from wb.math.nutcracker import helpers, soil_moisture, compute_GDD
from weatherscore import weatherscore

MAX_ATTEMPTS = 2
START_DATE = datetime.date(1982,1,1)
MEASUREMENTS = [MeasurementTypeEnum.PRECIPITATION, MeasurementTypeEnum.MAX_TEMPERATURE]
DISTANCES = {MeasurementTypeEnum.PRECIPITATION : 20, # km
             MeasurementTypeEnum.MAX_TEMPERATURE : 150} # km

MEASUREMENT_DICT = {MeasurementTypeEnum.PRECIPITATION: 'precip',
					MeasurementTypeEnum.MAX_TEMPERATURE: 'tmax'}
NETWORKS = {MeasurementTypeEnum.PRECIPITATION : StationNetworkEnum.AHPS,
        		MeasurementTypeEnum.MAX_TEMPERATURE : StationNetworkEnum.EARTHSAT}
YEARS = np.arange(START_DATE.year, 2012)
services.DIRECT = True

def get_many_stations(lat, lng, measurement):
    with services.use("metro") as m:
		for i in range(MAX_ATTEMPTS):
			try:
				res = m.find_stations_within_radius(DISTANCES[measurement], lat, lng, network=NETWORKS[measurement])
				return sort_by_distance(res)
			except:
				pass

def sort_by_distance(stat_obj):
	dist = stat_obj.distances
	sorted_by_dist = sorted(dist.iteritems(), key=lambda x: x[1].distance)
	return [(x[0], x[1].distance) for x in sorted_by_dist]

def get_historical_dates(date, start_date):
	start_year = start_date.year
	this_year = datetime.date.today().year
	historical_dates = []
	for year in xrange(start_year, this_year):
		hist_date = helpers.handle_leap_year(date, year)
		historical_dates.append(hist_date)
	return historical_dates

def get_int_from_dates(date, start_date):
	historical_dates = get_historical_dates(date, start_date)
	int_dates = []
	for date in historical_dates:
		int_dates.append((date - start_date).days)
	return int_dates

def get_avg_temp(temp_on_day):
	return np.mean(temp_on_day)

def get_sd_temp(temp_on_day):
	return np.std(temp_on_day)

def get_temp_stats(core_data, int_dates):
	temp_stats = {}

	temp_on_day = core_data['tmax'][int_dates]
	temp_on_day = compute_GDD.handle_nans(temp_on_day)
	temp_stats['max temp'] = temp_on_day.tolist()
	avg_temp = get_avg_temp(temp_on_day)
	temp_stats['average temp'] = avg_temp

	sd_temp = get_sd_temp(temp_on_day)
	temp_stats['sd temp'] = sd_temp

	return temp_stats

def get_precip_stats(core_data, int_dates):
	precip_stats = {}

	precip_on_day = core_data['precip'][int_dates]
	precip_on_day = soil_moisture.handle_nans(precip_on_day)
	precip_stats['precip'] = precip_on_day.tolist()
	precip_stats['chance of rain'] = get_chance_of_rain(precip_on_day)
	precip_stats['binned precip'] = get_binned_precip(precip_on_day)
	return precip_stats


def get_binned_precip(precip_on_day):
	binned_precip = []
	bins = [0, 0.05, 0.5, 1.0]

	for (lower, upper) in iterlib.pairwise(bins):
		key = '%s to %s' %(lower, upper)
		precip_in_range = (precip_on_day >= lower) * (precip_on_day < upper)
		val = int(round(float(np.sum(precip_in_range))/len(precip_on_day) * 100))
		if val > 1:
			binned_precip.append((key, val))
	key = 'Above %s' %bins[-1]
	val = int(round(float(np.sum(precip_on_day > bins[-1]))/len(precip_on_day) * 100))
	if val > 1:
		binned_precip.append((key, val))
	return binned_precip


def get_chance_of_rain(precip_on_day):
	return (int(round(float(np.sum(precip_on_day > 0.001))/len(precip_on_day) * 100)))

def get_weather_data(lat, lng, date, int_dates):
	obs_set = {}
	for meas in MEASUREMENTS:
		stat_by_dist = get_many_stations(lat, lng, meas)
		if stat_by_dist is not None:
			for station in stat_by_dist:
				core_data = nostralib.get_observations(stationId=station[0], measurements=MEASUREMENTS,
							   						start=START_DATE, end=datetime.date.today())
				if check_good_data(core_data, int_dates, meas):
					obs_set[meas] = core_data
					break

	return obs_set

def check_good_data(core_data, int_dates, meas):
	num_nans = np.sum(np.isnan(core_data[MEASUREMENT_DICT[meas]][int_dates]))
	if num_nans > 0.6 * len(int_dates):
		return False
	return True

def get_stats(lat, lng, date):
	int_dates = get_int_from_dates(date, START_DATE)
	obs_set = get_weather_data(lat, lng, date, int_dates)
	return day_stats(obs_set, int_dates)

def day_stats(obs_set, int_dates):
	stats = {}
	if MeasurementTypeEnum.MAX_TEMPERATURE in obs_set:
		stats.update(get_temp_stats(obs_set[MeasurementTypeEnum.MAX_TEMPERATURE], int_dates))
	if MeasurementTypeEnum.PRECIPITATION in obs_set:
		stats.update(get_precip_stats(obs_set[MeasurementTypeEnum.PRECIPITATION], int_dates))

	try:
	    (score, scoretext) = weatherscore(stats['average temp'], stats['chance of rain'])
	    stats['score'] = score
	    stats['score text'] = scoretext
	    return stats, obs_set, int_dates
	except:
		return

def get_better_date(date, obs_set, int_dates, score):
	best_score = score
	better_day = False
	## Look one week on either side

	for day_delta in xrange(-7, 8):
		if day_delta != 0:
			new_int_dates = np.array([day + day_delta if day + day_delta > 0 else np.nan for day in int_dates])
			if np.sum(np.isnan(new_int_dates)) > 0:
				non_nan = ~np.isnan(new_int_dates)
				new_int_dates = new_int_dates[non_nan]
				new_int_dates = new_int_dates.tolist()

			## "Better date will be based on the score"
			res = day_stats(obs_set, new_int_dates)
			if res[0]['score'] > best_score:
				best_score = res[0]['score']
				best_day = date + datetime.timedelta(day_delta)
				best_stats = copy.deepcopy(res[0])
				better_day = True

	if better_day:
		better_day_data = {'recommended day': helpers.convert_dates_to_str(best_day)}
		better_day_data['better day stats'] = best_stats
		return better_day_data
	else:
		return {'recommended day': None}


def main():
    parser = OptionParser()
    parser.add_option("-l", "--lat", default=None, action="store",
                      help="parameter filename")
    parser.add_option("-n", "--lon", default=None, action="store",
                      help="parameter filename")
    parser.add_option("-d", "--date", default=None, action="store",
                      help="parameter filename")
    parser.add_option("-r", "--recommend", default=None, action="store",
                      help="parameter filename")

    opts, args = parser.parse_args()

    ## check if lat
    if not opts.lat:
    	parser.error("Please specify latitude")
    if not opts.lon:
    	parser.error("Please specify longitude")
    if not opts.date:
    	parser.error("Please specify date")

    stats, obs_set, int_dates = get_stats(float(opts.lat), float(opts.lon), helpers.to_date(opts.date))

    if opts.recommend:
	    better_stats = get_better_date(helpers.to_date(opts.date), obs_set, int_dates, stats['score'])
	    if stats:
	    	stats.update(better_stats)
	    else:
	    	stats = better_stats

    sys.stdout.write(simplejson.dumps(stats))



if __name__ == "__main__":
    try:
        sys.exit(main())
    except SystemExit:
        raise
    except KeyboardInterrupt:
        sys.exit(1)

