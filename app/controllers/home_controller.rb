class HomeController < ApplicationController
  def index

  end

  def test


    render :text=>"Hello ME"
  end

  def is_good_day

    lat = params["lat"]
    lng = params["lng"]
    #date = params["date"]
    date = '2012-01-01'
    script_path = Rails.root.to_s + "/script/python/"
    p script_path
    cmd = "/export/disk0/wb/python/bin/python #{script_path}/get_weather_data.py --lat #{lat} --lon #{lng} --date #{date}"
    output = `#{cmd}`

    render :text=>output
  end

end
