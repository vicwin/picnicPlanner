Ext.application({
    name: 'Picnic Planer',
    launch: function() {
        
     // Ext.Loader.setConfig({enabled:true});

        Ext.create('Ext.container.Viewport', {
            //layout: 'border',
            autoScroll: true,
            items: [

                // {
                //     title: 'Calender',
                //     high: 200, 
                //     border: true,
                //     contentEl: 'event_calender'
                // // },
                // {
                //     title: 'Charts',
                //     high: 200, 
                //     border: true,
                //     contentEl: 'charts'
                // },
                {
                    title: 'Picnic Planer',
                    autoHeight: true,
                    autoWidth: true,
                    border: true,
                    contenEl: 'event_planner_map'
                }
            ]
        });

        Ext.define('App.Planner', {
          name: 'Event Planner',
          statics:{
            initilizeGoogleMap: function(){
              var myOptions = {
                center: new google.maps.LatLng(43.40, -89.24),
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP
              };
              var map = new google.maps.Map(document.getElementById("event_planner_map"),
                                            myOptions);
                                            return map;
            },
            initializeCalender: function(render_elm_id){
              Ext.create('Ext.panel.Panel', {
                title: 'Choose a future date:',
                width: 200,
                bodyPadding: 10,
                renderTo: render_elm_id,
                items: [{
                  xtype: 'datepicker',
                  minDate: new Date(),
                  handler: function(picker, date) {
                    // do something with the selected date
                  }
                }]
              });
            }
          },

          constructor: function(obj_config) {
            // if (name) {
            //   this.name = name;
            // }
            // Initilize Google Maps
            this.key = "AIzaSyDcW-dciX5-CATmF6AthTkU4IzJSEDriac";
            this.googleMap = this.self.initilizeGoogleMap(); // "This is Google Map";
            this.active_maker = null;
            // this.chart = new Highcharts.Chart(chart_config);
            // this.chart1 = new Highcharts.Chart(chart_config1);

            //this.chart = new Highcharts.Chart(char_config);
            this.geoCoder = new google.maps.Geocoder();
            //this.calender = this.self.initializeCalender("cal");

            this_obj = this;
            //console.log(this.googleMap);
            return this;
          },

          setupHandler: function(){
            google.maps.event.addListener(this_obj.googleMap, "click", this_obj.addMarker);
          },
          setCenter: function(latLng){
            this_obj.googleMap.setCenter(latLng);
          },
          googlePlaceToLatLng: function(address){
          
          
          },
          googlePlaceSuggest: function(address, option){
            var geo_coder_request = {
              address: address,
              bounds: this_obj.googleMap.getBounds(),
              latLng: this_obj.googleMap.getCenter()
             };
             this_obj.geoCoder.geocode( geo_coder_request, function(results, status) {
               if (status == google.maps.GeocoderStatus.OK) {
                 var store = option["store"];
                 //alert(results[0].geometry.location);
                 var new_array = []
                 var name_to_latlng = {}
                 for(i=0; i < results.length; i++){
                   name_to_latlng[results[i].formatted_address] = results[i];

                   new_array.push({"abbr":results[i].geometry.location, 
                                  "name":results[i].formatted_address});
                 };
                 option["store"].loadData(new_array);

                 // map.setCenter(results[0].geometry.location);
                 // var marker = new google.maps.Marker({
                 //   map: map,
                 //   position: results[0].geometry.location
                 // });
               } else {
                 //alert("Geocode was not successful for the following reason: " + status);
               }
             });
          },
          buildPlaceWindow: function(address, data, marker){
            var new_window = Ext.create('Ext.window.Window', {
              title: address,
              height: 1000,
              width: 1000,
              closeAction : 'hide',
              layout: 'fit',
              collapsible: true,
              items:[
                {
                  title: 'Charts',
                  high: 200, 
                  border: true,
                  contentEl: 'charts'
                }
              ]
              // items: [  // Let's put an empty grid in just to illustrate fit layout
              //   {
              
              //   }
              // ]
            }).show();
            marker.placeWindow = new_window;
            return new_window;
          },
          addMarker: function(event){
            if (this_obj.active_marker != null)
            {
              //this_obj.active_marker.setMap(null);
              this_obj.active_marker.placeWindow.collapse();
            };

            var marker = new google.maps.Marker({
              position: event.latLng,
              animation: google.maps.Animation.DROP,
              map: this_obj.googlgeMap
            });

            this_obj.active_marker = marker;
            marker.setMap(this_obj.googleMap);
            Ext.Ajax.request({
              url: '/home/is_good_day',
              params: {
                id: 1,
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
                date: Ext.getCmp("plan_date").getValue()
              },
              success: function(response){

                var text = response.responseText;
                //Ext.Msg.alert("Hello", text);
                //debugger;
                marker.chart = new Highcharts.Chart(chart_config);
                marker.chart1 = new Highcharts.Chart(chart_config1);
                data = Ext.JSON.decode(text)
                marker.chart_data = data;
                marker.chart.series[0].setData(data["binned precip"], true)
                marker.chart1.series[0].setData(data["precip"])
                marker.chart1.series[1].setData(data["max temp"], true)
                marker.chart1.xAxis[0].setCategories(['\'82', '\'83', '\'84', '\'85',
                  '\'86', '\'87', '\'88', '\'89', '\'90',
                  '\'91', '\'92', '\'93', '\'94', '\'95',
                  '\'96', '\'97', '\'98', '\'99', '\'00',
                  '\'01', '\'02', '\'03', '\'04', '\'05',
                  '\'06', '\'07', '\'08', '\'09', '\'10', '\'11'])
                //Ext.Msg.alert("Hello", text);
                //debugger;
                //this_obj.chart.series[0].setData([["x", 34], ["y",66]]);
                  //debugger
                this_obj.buildPlaceWindow(event["name"] , data, marker);
                var data_html = 
                  '<table width="100%" height="100%" class="info" >' + 
                  '<td>Average Temprarture</td> <td>Chance of Rain</td> <td>Recommandation</td>' + 
                  '<tr><td>{average_temp} F</td> <td>{chance_of_rain} Percent</td> <td>{score_text}</td> </tr> <table></br>';
                var tpl = new Ext.Template(data_html);
                var data2 = {
                  average_temp: data["average temp"],
                  chance_of_rain: data["chance of rain"],
                  score_text: data["score text"]
                }
                tpl.append('chart_text', data2 );

                google.maps.event.addListener(marker, 'click', function(){
                  marker.placeWindow.show();
                });
                // process server response here
              }
            });
           // this_obj.googleMap.setCenter(event.latLng);
          },

        });

      var new_planner = Ext.create("App.Planner","");
      new_planner.setupHandler();

       // //Create the spotlight component
      var spot = Ext.create('Ext.ux.Spotlight', {
          easing: 'easeOut',
          duration: 300
      });

      Ext.QuickTips.init();
      /*
      * ================  Simple form  =======================
      */

      var states = Ext.create('Ext.data.Store', {
        fields: ['abbr', 'name'],
        data : [
          // {"abbr":"AL", "name":"Alabama"},
          // {"abbr":"AK", "name":"Alaska"},
          // {"abbr":"AZ", "name":"Arizona"}
          // //...
        ]
      });
      var simple = Ext.create('Ext.form.Panel', {
          url:'save-form.php',
          frame: true,
          id: "planner_input",
         //bodyStyle:'padding:5px 5px 0',
          fieldDefaults: {
              msgTarget: 'side',
              labelWidth: 75
          },
          defaults: {
              anchor: '100%'
          },

          items: [{
              id: 'address',
              fieldLabel: 'Address',
              name: 'address',
              xtype: 'combobox',
              store: states,
              queryMode: 'local',
              typeAhead: true,
              typeAheadDelay: 500,
              displayField: 'name',
              valueField: 'abbr',
              allowBlank: true,
              enableKeyEvents: true,
              listeners: {
                'keyup': function(this_field, event, obj){
                  if(this_field.getValue().length >= 4){
                    //alert("me");
                    new_planner.googlePlaceSuggest(this_field.getValue(),
                                                   { store: states, key_code: event.keyCode });
                  }
                },
                'select': function(this_field){
                  var found_index = states.find("abbr", this_field.getValue());
                  if(found_index != -1)
                    new_planner.setCenter(states.getAt(found_index).data["abbr"]);
                }
              }
          },{
              xtype: 'datefield',
              fieldLabel: 'Date',
              id: 'plan_date',
              name: 'date',
              allowBlank: true
          }],

          buttons: [{
              text: 'Go Planning',
              handler: function(){
                var address_field = Ext.getCmp("address");
                var found_index = states.find("abbr", address_field.getValue());
                var place_latlng = states.getAt(found_index).data["abbr"];
                 // new google.maps.LatLng(-34.397, 150.644)
                var event_obj = {
                  latLng: place_latlng, 
                  name: states.getAt(found_index).data["name"] 
                };
                new_planner.addMarker(event_obj);
                
                // id = 'input_window' ;
                // if (typeof id == 'string') {
                //   spot.show(id);
                // } else if (!id && spot.active) {
                //   spot.hide();        
                // };
               // var new_planner = Ext.create("App.Planner","");
               // Ext.Msg.alert("Alert:", new_planner.gooleMap);
              }
          }]
      });
      //simple.render(bd);

      //new_planner.googlePlaceSuggest("husee");
        var input_form = Ext.create('Ext.window.Window', {
        title: 'Plan Your Picnik: ',
        id: 'input_window',
        x: 80,
        y: 40,
        height: 150,
        width: 400,
        layout: 'fit',
        closable: false,
        collapsible: true,
        items: [  // Let's put an empty grid in just to illustrate fit layout
          simple
        ]
        // listeners: {
        //   afterrender: function(win) {
        //     win.mon(win.el, {
        //       mouseout: function() {
        //         win.collapse();
        //         win.collapsed = true;
        //       },
        //       mouseover: function(){
        //         if(win.collapsed)
        //         {
        //           win.expand();
        //           win.collapsed = false;
        //         }
        //       }
        //     })
        //   }
        // }
      }).show();




    } //end of launch
});
