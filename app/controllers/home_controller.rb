class HomeController < ApplicationController
  def index

  end

  def test


    render :text=>"Hello ME"
  end

  def is_good_day


    lat = params["lat"] 
    lng = params["lng"] 
    date = params["date"]

    script_path = Rails.root.to_s + "/script/python/"
    p script_path
    #cmd = "/export/disk0/wb/python/bin/python #{script_path}/get_weather_data.py --lat #{lat} --lon #{lng} --date #{date}"
    #output = `#{cmd}`

    dummmy_output='{"average temp": 27.436666679382324, "precip": [0.05929163470864296, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.04611930251121521, 0.0, 0.042706374078989029, 0.0, 0.077030867338180542, 0.0, 0.0, 0.08698754757642746, 0.05300777405500412, 0.0, 0.0, 0.0, 0.013779332861304283, 0.30634230375289917, 0.15000000596046448, 0.0, 0.038976378738880157, 0.052362203598022461, 0.0, 0.0], "binned precip": [["0 to 0.05", 77], ["0.05 to 0.5", 23]], "score": 97200, "chance of rain": 37, "max temp": [17.0, 30.0, 26.0, 25.0, 21.0, 35.0, 14.0, 31.0, 42.0, 27.0, 33.0, 10.0, 30.0, 19.0, 32.0, 32.0, 44.0, 17.0, 36.0, 25.0, 26.0, 25.0, 37.0, 31.0, 36.0, 41.0, 18.0, 24.0, 19.0, 20.100000381469727], "sd temp": 8.4456885668946207, "score text": "RED: Too cold to go out!"}'

    render :text=>dummmy_output
  end

end
