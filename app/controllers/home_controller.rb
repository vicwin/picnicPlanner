class HomeController < ApplicationController
  def index

  end

  def test


    render :text=>"Hello ME"
  end

  def is_good_day

    lat = params["lat"] 
    lng = params["lng"] 
    script_path = Rails.root.to_s + "/script/python/"
    p script_path
    cmd = "python #{script_path}/simple.py -l#{lat} -n#{lng}"
    output = `#{cmd}`

    render :text=>output
  end

end
