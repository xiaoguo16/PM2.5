/**
 * Created by xiaoguo on 2016/8/1.
 */
// create a map in the "map" div, set the view to a given place and zoom
var map = L.map('map').setView([37.87, 112.53], 6)//中心坐标和缩放比例
    .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));//将图层添加到地图上
// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

// add a marker in the given location, attach some popup content to it and open the popup
L.marker([37.87, 112.53]).addTo(map)
    .bindPopup('太原市')
    .openPopup();

L.marker([40.12, 113.30]).addTo(map)
    .bindPopup('大同市')
    .openPopup();

L.marker([35.03, 110.97]).addTo(map)
    .bindPopup('运城市')
    .openPopup();

//L.marker([35.52, 112.83]).addTo(map)
//    .bindPopup('晋城市')
//    .openPopup();
//
//L.marker([36.18, 113.08]).addTo(map)
//    .bindPopup('长治市')
//    .openPopup();
//
//L.marker([36.08, 111.50]).addTo(map)
//    .bindPopup('临汾市')
//    .openPopup();

//禁止移动和缩放
//map.dragging.disable();
//map.touchZoom.disable();
//map.doubleClickZoom.disable();
//map.scrollWheelZoom.disable();

var tooltip=d3.select("body")
    .append("div")
    .attr("class","tooltip")
    .style("opacity",0.0);

var svg = d3.select(map.getPanes().overlayPane).append("svg");

var g = svg.append("g");


var data=[
    {location:"太原",latitude:37.87,longitude:112.53,dataset:[["CO",50],["SO2",20],["NO",20],["NO2",20]]},
     {location:"大同",latitude:40.12,longitude:113.30,dataset:[["CO",80],["SO2",20],["NO",20],["NO2",20]]},
    {location:"运城",latitude:35.03,longitude:110.97,dataset:[["CO",90],["SO2",20],["NO",50],["NO2",20]]}
];


function project(a,b){
    var latlng=L.latLng(a,b),
        trans=map.latLngToLayerPoint(latlng);//将地理坐标变换为图层上的位置
    return [trans.x,trans.y];
}
//饼图参数
var pie = d3.pie()
    .sortValues(function (a, b) {
        return b - a
    })
    .startAngle(Math.PI * 0.4)
    .endAngle(Math.PI * 1.6)
    .value(function (d) {
        return d[1];
    });
var outerRadius = 30, innerRadius = 0;
var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);
var color = d3.scaleOrdinal(d3.schemeCategory20);

map.on("viewreset", reset);//当地图需要重绘内容时触发。
 reset();


function reset() {

    svg.selectAll(".g_arc").remove();//移除缩放前的g元素

    data.forEach(function (d, i) {
        var bounds = map.getBounds(),
            topLeft = map.latLngToLayerPoint(bounds.getNorthWest());//将经纬度的左上角的点转换为图层上的点

        svg.attr('id', 'overlay')
            .attr("class", "leaflet-zoom-hide")
            .style("width", map.getSize().x + 'px')//返回现有地图容器大小,地图宽度
            .style("height", map.getSize().y + 'px')//地图高度
            .style("margin-left", topLeft.x + "px")
            .style("margin-top", topLeft.y + "px");

        g.attr("transform", "translate(" + (-topLeft.x) + "," + (-topLeft.y) + ")");

        var tmp = project(d.latitude, d.longitude),
            x = tmp[0], y = tmp[1];

        var piedata = pie(d.dataset);

        var arcs = g.selectAll("g" + i)
            .data(piedata)
            .enter()
            .append("g")
            .attr("class", "g_arc")
            .attr("transform", function () {
                return "translate(" + x + "," + y + ")";
            });
        arcs.append("path")
            .attr("fill", function (m, i) {
                return color(i);
            })
            .attr("d", function (m) {
                return arc(m);
            });

        arcs.on("mouseover",function(d){
            tooltip.html(d.data[0]+"浓度" +"<br />" + d.data[1] )
                .style("left",(d3.event.pageX) +"px")
                .style("top",(d3.event.pageY +20) +"px")
                .style("opacity",1.0);
        })
            .on("mousemove",function(d){
                tooltip.style("left",(d3.event.pageX) +"px")
                    .style("top",(d3.event.pageY +20)  +"px");
            })
            .on("mouseout",function(d){
                tooltip.style("opacity",0.0);
            });
        //tooltip.style("box-shadow","10px 0px 0px" +color (i));

    })
}


