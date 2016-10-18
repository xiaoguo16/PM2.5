// Create map
map = mapbox.map('map');
map.addLayer(new MM.TemplatedLayer('./maptiles/{Z}/{X}/{Y}.png'));
map.setPanLimits([{ lat: 15, lon: 105 }, { lat: 60, lon: 135 }]);

// Draw the map using mapbox.js
var mapView = (function() {
    mapView = {};
    mapView.mapSVG = null;

    mapView.d3layer = (function() {
        var f = {};
        var div = d3.select('#d3-map');
        mapView.mapSVG = div.append('svg');
        g = mapView.mapSVG.append('g');

        var filter = mapView.mapSVG.append('defs')
            .append('filter')
            .attr('id', 'shadow')
            .attr('x', '0')
            .attr('y', '0')
            .attr('width', '200%')
            .attr('height', '200%');
        filter.append('feGaussianBlur')
            .attr('result', 'blur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', '4');
        filter.append('feOffset')
            .attr('result', 'offsetBlur')
            .attr('in', 'blur')
            .attr('dx', '4')
            .attr('dy', '4');
        filter.append('feBlend')
            .attr('in', 'SourceGraphic')
            .attr('in2', 'offsetBlur')
            .attr('mode', 'normal');

        f.parent = div.node();

        f.project = function(x) {
            var point = mapView.map.locationPoint({ lat: x[1], lon: x[0] });
            return [point.x, point.y];
        };

        var first = true;
        var arcScale = d3.scale.pow()
            .domain([0, 300])
            .range([10, 50]);

        // Path function for arcs.
        f.path = function(type) {
            return d3.svg.arc()
                .innerRadius(function(d) {
                    return 0;
                })
                .outerRadius(function(d) {
                    if (d == null || d.length==0) return 0;
                    var tmp = d[d.length-1].value;
                    tmp = arcScale(tmp);
                    return tmp;
                })
                .startAngle(function(d) {
                    var i = parseInt(typesIndex[type]);
                    return i * (Math.PI * 2 / 5);
                })
                .endAngle(function(d) {
                    var i = parseInt(typesIndex[type]) + 1;
                    return i * (Math.PI * 2 / 5);
                });
        };

        f.draw = function() {
            // Initialize.
            first && mapView.mapSVG.attr('width', f.map.dimensions.x)
                .attr('height', f.map.dimensions.y)
                .style('margin-left', '0px')
                .style('margin-top', '0px') && (first = false);

            if (f.isArea) {
                $('.d3-vec .zone-grp').hide();
                $('.d3-vec .stations-grp').show();
                f.isArea = false;
            }

            // Refresh the stations path.
            g.selectAll('.stations-grp')
                .attr('transform', function(d) {
                    var co = [d.lon, d.lat];
                    var tmp = f.project(co);
                    var x = tmp[0];
                    var y = tmp[1];
                    return 'translate(' + x + ',' + y + ')';
                });

        };

        f.data = function() {
            f.stationGroups = [];

            for (si in dataCenter.stationData) {
                var station = dataCenter.stationData[si];
                if (dataCenter.eachStation[station.short_name] == null) continue;

                d3.select('g.stations-grp-' + si).remove();

                stationGroup = g.append('g')
                    .datum(station)
                    .attr('class', 'stations-grp stations-grp-' + si)
                    .attr('filter', 'url(#shadow)');

                for (t in types) {
                    stationGroup
                        .append('path')
                        .datum(dataCenter.eachStation[station.short_name][types[t]])
                        .classed('arc', true)
                        .classed(types[t], true)
                        .attr('fill', colors[t])
                        .attr('d', f.path(types[t]))
                        // .attr('class', function(d) {
                        //   if (!d.byTime[currentStatus.selectedTime]) return '';
                        //   var o = d.byTime[currentStatus.selectedTime][0];
                        //   var className = 'arc';
                        //   if (d.type == 'PM2.5') className += ' arc-PM25';
                        //   else className += ' arc-' + d.type;
                        //   if (isNaN(o.value)) className += '-no-record no-record';
                        //   return className;
                        // })
                        .attr('title', function(d) {
                            if ( d == undefined ) return;
                            if(d.length == 0) return ;
                            d.type = types[t];
                            var record = d[d.length-1];
                            var value = record.value;
                            return '<p>' + types[t] + '浓度: ' + (value ? value : '(无数�?)') + '</p>'
                                + '<p>' + station.name + '棢�测站</p>'
                                + '<p>' + record.time + '</p>';
                        });
                }

                stationGroup.append('text')
                    .text(station['name'])
                    .attr("transform", "translate(5, 35)")
                    .attr('class', 'unshow')

                f.stationGroups.push(stationGroup);
            }
            $('.arc').tipsy({gravity: 's', html: true});

            return f;
        }

        f.refresh = function() {
            first = false;
            f.draw();
        }

        f.refreshTime = function() {
            // Refresh the stations.
            g.selectAll('.arc')
                .attr('d', f.path)
            // .attr('title', function(d) {
            //   if (d.byTime[currentStatus.selectedTime] == undefined) return '';
            //   var o = d.byTime[currentStatus.selectedTime][0];
            //   return '<p>' + d.type + '浓度: ' + (o.value ? o.value : '(无数�?)') + '</p>'
            //     + '<p>' + data.stationsMap[o.station].station.name + '棢�测站</p>'
            //     + '<p>' + o.date.getFullYear() + '�?' + (o.date.getMonth() + 1) + '�?'
            //     + o.date.getDate() + '�?' + o.date.getHours() + ':00:00</p>'
            //     ;
            // })
            // .attr('class', function(d) {
            //   if (d.byTime[currentStatus.selectedTime] == undefined) return '';
            //   var o = d.byTime[currentStatus.selectedTime][0];
            //   var className = 'arc';
            //   if (o.type == 'PM2.5') className += ' arc-PM25';
            //   else className += ' arc-' + d.type;
            //   if (isNaN(o.value)) className += '-no-record no-record';
            //   return className;
            // })
            // .classed('hidden', function(d) {
            //   if (selectedArray.indexOf(d.type) == -1) return true;
            //   return false;
            // })
            // .classed('no-record', function(d) {
            //   if (d.byTime[currentStatus.selectedTime] == undefined) return true;
            //   var o = d.byTime[currentStatus.selectedTime][0];
            //   if (isNaN(o.value)) return true;
            //   return false;
            // })
            // .classed('selected', function(d) {
            //   if (d.byTime[currentStatus.selectedTime] == undefined) return false;
            //   var o = d.byTime[currentStatus.selectedTime][0];
            //   if (o.station == currentStatus.selectedLocation)
            //     return true;
            //   return false;
            // })
            // .classed('unselected', function(d) {
            //   if (d.byTime[currentStatus.selectedTime] == undefined) return false;
            //   var o = d.byTime[currentStatus.selectedTime][0];
            //   if (!currentStatus.selectedLocation) return false;
            //   if (o.station == currentStatus.selectedLocation)
            //     return false;
            //   return true;
            // });
            first = false;
            f.draw();
        }

        return f;
    })();

    // Add d3 layer
    var l;
    mapView.loadDataForMap = function() {
        l = mapView.d3layer.data();
        map.addLayer(l);
    }

    map.centerzoom({
        lat: 39.899,
        lon: 116.395
    }, 11);
    map.setZoomRange(8, 12);
    map.setPanLimits([{ lat: 15, lon: 105 }, { lat: 60, lon: 135 }]);

    mapView.map = map;
    return mapView;
})();/**
 * Created by xiaoguo on 2016/9/8.
 */
