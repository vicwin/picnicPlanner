var chart_config = {
					chart: {
						renderTo: 'chart_container',
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false
					},
					title: {
						text: 'Rainfall distribution in past years'
					},
					tooltip: {
						formatter: function() {
							return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
						}
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: 'pointer',
							dataLabels: {
								enabled: true,
								color: '#000000',
								connectorColor: '#000000',
								formatter: function() {
									return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
								}
							}
						}
					},
				    series: [{
						type: 'pie',
						name: 'Precipitation chances'
					}]
				};

var chart_config1 = {
					chart: {
						renderTo: 'chart_container1',
						zoomType: 'xy'
					},
					title: {
						text: 'Historical Temperature and Rainfall'
					},
					subtitle: {
						text: 'Source: www.climate.com'
					},
					xAxis: [{
						categories: ['\'82', '\'83', '\'84', '\'85',
									'\'86', '\'87', '\'88', '\'89', '\'90',
									'\'91', '\'92', '\'93', '\'94', '\'95',
									'\'96', '\'97', '\'98', '\'99', '\'00',
									'\'01', '\'02', '\'03', '\'04', '\'05',
									'\'06', '\'07', '\'08', '\'09', '\'10', '\'11']
					}],
					yAxis: [{ // Primary yAxis
						labels: {
							formatter: function() {
								return this.value +'°C';
							},
							style: {
								color: '#89A54E'
							}
						},
						title: {
							text: 'Temperature',
							style: {
								color: '#89A54E'
							}
						}
					}, { // Secondary yAxis
						title: {
							text: 'Rainfall',
							style: {
								color: '#4572A7'
							}
						},
						labels: {
							formatter: function() {
								return this.value +' mm';
							},
							style: {
								color: '#4572A7'
							}
						},
						opposite: true
					}],
					tooltip: {
						formatter: function() {
							return ''+
								this.x +': '+ this.y +
								(this.series.name == 'Rainfall' ? ' mm' : '°C');
						}
					},

					legend: {
						layout: 'vertical',
						align: 'left',
						x: 120,
						verticalAlign: 'top',
						y: 100,
						floating: true,
						backgroundColor: '#FFFFFF'
					},
					series: [{
						name: 'Rainfall',
						color: '#4572A7',
						type: 'column',
						yAxis: 1,
						//data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

					}, {
						name: 'Temperature',
						color: '#89A54E',
						type: 'spline',
						//data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
					}]
};

				/*
var chart_config1 = {
					chart: {
						renderTo: 'container',
						zoomType: 'xy'
					},
					title: {
						text: 'Average Monthly Temperature and Rainfall in Tokyo'
					},
					subtitle: {
						text: 'Source: WorldClimate.com'
					},
					xAxis: [{
						categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
							'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
					}],
					yAxis: [{ // Primary yAxis
						labels: {
							formatter: function() {
								return this.value +'°C';
							},
							style: {
								color: '#89A54E'
							}
						},
						title: {
							text: 'Temperature',
							style: {
								color: '#89A54E'
							}
						}
					}, { // Secondary yAxis
						title: {
							text: 'Rainfall',
							style: {
								color: '#4572A7'
							}
						},
						labels: {
							formatter: function() {
								return this.value +' mm';
							},
							style: {
								color: '#4572A7'
							}
						},
						opposite: true
					}],
					tooltip: {
						formatter: function() {
							return ''+
								this.x +': '+ this.y +
								(this.series.name == 'Rainfall' ? ' mm' : '°C');
						}
					},

					/*legend: {
						layout: 'vertical',
						align: 'left',
						x: 120,
						verticalAlign: 'top',
						y: 100,
						floating: true,
						backgroundColor: '#FFFFFF'
					}, *//*
					series: [{
						name: 'Rainfall',
						color: '#4572A7',
						type: 'column',
						yAxis: 1,
						data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

					}, {
						name: 'Temperature',
						color: '#89A54E',
						type: 'spline',
						data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
					}]
}; */