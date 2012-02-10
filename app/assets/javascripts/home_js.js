Ext.application({
    name: 'Picnic Planer',
    launch: function() {
        Ext.create('Ext.container.Viewport', {
            //layout: 'border',
            autoScroll: true,
            items: [
                {
                    title: 'Calender',
                    high: 200,
                    border: true,
                    contentEl: 'event_calender'
                },{
                    title: 'Charts',
                    high: 200,
                    border: true,
                    contentEl: 'charts'
                },
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
            this.chart = new Highcharts.Chart(chart_config);
            this.chart1 = new Highcharts.Chart(chart_config1);
            this_obj = this;
            //console.log(this.googleMap);
            return this;
          },

          setupHandler: function(){
            google.maps.event.addListener(this_obj.googleMap, "click", this_obj.addMarker);
          },

          addMarker: function(event){
            if (this_obj.active_marker != null)
              this_obj.active_marker.setMap(null);

            var marker = new google.maps.Marker({
              position: event.latLng,
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
              },
              success: function(response){
                var text = response.responseText;
                Ext.Msg.alert("Hello", text);
                //debugger;
                data = Ext.JSON.decode(text)
                this_obj.chart.series[0].setData(data["binned precip"], true)
                this_obj.chart1.series[0].setData(data["precip"])
                this_obj.chart1.series[1].setData(data["max temp"], true)
                this_obj.chart1.xAxis[0].setCategories(['\'82', '\'83', '\'84', '\'85',
                  '\'86', '\'87', '\'88', '\'89', '\'90',
                  '\'91', '\'92', '\'93', '\'94', '\'95',
                  '\'96', '\'97', '\'98', '\'99', '\'00',
                  '\'01', '\'02', '\'03', '\'04', '\'05',
                  '\'06', '\'07', '\'08', '\'09', '\'10', '\'11'])
                // process server response here
              }
            });
           // this_obj.googleMap.setCenter(event.latLng);
          },

        });

      Ext.QuickTips.init();
      /*
      * ================  Simple form  =======================
      */

      var simple = Ext.create('Ext.form.Panel', {
          url:'save-form.php',
          frame:true,
          title: 'Simple Form',
          bodyStyle:'padding:5px 5px 0',
          width: 350,
          fieldDefaults: {
              msgTarget: 'side',
              labelWidth: 75
          },
          defaultType: 'textfield',
          defaults: {
              anchor: '100%'
          },

          items: [{
              fieldLabel: 'First Name',
              name: 'first',
              allowBlank:false
          },{
              fieldLabel: 'Last Name',
              name: 'last'
          },{
              fieldLabel: 'Company',
              name: 'company'
          }, {
              fieldLabel: 'Email',
              name: 'email',
              vtype:'email'
          }, {
              xtype: 'timefield',
              fieldLabel: 'Time',
              name: 'time',
              minValue: '8:00am',
              maxValue: '6:00pm'
          }],

          buttons: [{
              text: 'Save',
              handler: function(){
                var new_planner = Ext.create("App.Planner","");
               // Ext.Msg.alert("Alert:", new_planner.gooleMap);
              }
          },{
              text: 'Cancel'
          }]
      });
      //simple.render(bd);

      var new_planner = Ext.create("App.Planner","");
      new_planner.setupHandler();
      Ext.create('Ext.window.Window', {
        title: 'Hello',
        height: 200,
        width: 400,
        layout: 'fit',
        items: {  // Let's put an empty grid in just to illustrate fit layout
          xtype: 'grid',
          border: false,
          columns: [{header: 'World'}],                 // One header just for show. There's no data,
          store: Ext.create('Ext.data.ArrayStore', {}) // A dummy empty data store
        }
      });


    } //end of launch
});
