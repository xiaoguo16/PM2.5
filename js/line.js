
var width = 960,
    height = 500;

//var projection=d3.geoMercator()
//    .center([112.5,37])
//    .scale(1500)
//    .translate([width/2,height/2]);

//var path = d3.geoPath()
//    .projection(projection);
//
//var svg = d3.select("#map").append("svg")
//    .attr("width", width)
//    .attr("height", height);
//
//d3.json("./json/shanxi.json", function (error, shanxi) {
//var groups=svg.append("g");
//        groups.selectAll("path")
//            .data(shanxi.features)
//            .enter().append("path")
//            .attr("stroke","#000")
//            .attr("stroke-width",1)
//            .attr("class","map")
//            .attr("d", path)
//          //  .style("fill", "#ccc")
//            .style("fill", function(d,i){
//                var data=[{name:"大同市",value:-13},{name:"晋城市",value:-3},{name:"晋中市",value:-9},{name:"临汾市",value:-2},{name:"吕梁市",value:-11},
//                    {name:"朔州市",value:-18},{name:"太原市",value:-9},{name:"忻州市",value:-11},{name:"阳泉市",value:-8},{name:"运城市",value:-7},
//                    {name:"长治市",value:-7}];
//                for(j=0;j<data.length;++j){
//                    if(data[j].name==shanxi.features[i].properties.name){
//                        var mapcolor=data[j].value;
//                       // return "rgb(255,255,"+(255+mapcolor*10)+")";
//                        return "rgb(255,255,"+(255+mapcolor*10)+")";
//                    }
//                }
//            });
//    render_time();
//
//});
render_time();
function render_time()
{
    var datatime=[
        [
           [1,105],[2,55],[3,80],[4,95],[5,120],[6,107],[7,103],[8,52],[9,55],[10,99],[11,124],[12,92],[13,89],
            [14,107],[15,85],[16,50],[17,78],[18,107],[19,128],[20,90],[21,123],[22,69],[23,63],[24,85],[25,115],[26,131],[27,99],
            [28,69],[29,55],[30,80]
        ]
    ];

    var marginline = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };
var widthline=1200,heightline=400,  widthz = widthline- marginline.left - marginline.right, heightz = heightline - marginline.bottom - marginline.top;

    var svgname = d3.select("#aqi").append("svg")
        .attr("width", widthline)
        .attr("height", heightline);

    svgname.append("g")
        .append("rect")
        .attr("x",marginline.left)
        .attr("y",heightline-marginline.bottom-heightz*0.1)
        .attr("width",widthline-marginline.left-marginline.right)
        .attr("height",heightz*0.1)
        .attr("class","rect")
        .style("fill","rgb(114,180,10)")
   // .style("opacity",0.6);

    svgname.append("g")
        .append("rect")
        .attr("x",marginline.left)
        .attr("y",heightline-marginline.bottom-heightz*0.2)
        .attr("width",widthline-marginline.left-marginline.right)
        .attr("height",heightz*0.1)
        .attr("class","rect")
        .style("fill","rgb(255,233,0)")
   //  .style("opacity",0.6);

    svgname.append("g")
        .append("rect")
        .attr("x",marginline.left)
        .attr("y",heightline-marginline.bottom-heightz*0.3)
        .attr("width",widthline-marginline.left-marginline.right)
        .attr("height",heightz*0.1)
        .attr("class","rect")
        .style("fill","rgb(228,122,0)")
    // .style("opacity",0.6);

    svgname.append("g")
        .append("rect")
        .attr("x",marginline.left)
        .attr("y",heightline-marginline.bottom-heightz*0.4)
        .attr("width",widthline-marginline.left-marginline.right)
        .attr("height",heightz*0.1)
        .attr("class","rect")
        .style("fill","rgb(194,2,43)")
     // .style("opacity",0.6);

    svgname.append("g")
        .append("rect")
        .attr("x",marginline.left)
        .attr("y",heightline-marginline.bottom-heightz*0.6)
        .attr("width",widthline-marginline.left-marginline.right)
        .attr("height",heightz*0.2)
        .attr("class","rect")
        .style("fill","rgb(155,0,100)")
     // .style("opacity",0.6);

    svgname.append("g")
        .append("rect")
        .attr("x",marginline.left)
        .attr("y",marginline.top)
        .attr("width",widthline-marginline.left-marginline.right)
        .attr("height",heightz*0.4)
        .attr("class","rect")
        .style("fill","rgb(145,56,25)")
     //.style("opacity",0.7);

    svgname.append("g")
        .attr("class","zhexian")
        .attr("transform", "translate(" + marginline.left + ","+marginline.top+")");

    var x = d3.scaleLinear().range([0, widthz]);
    var y = d3.scaleLinear().range([heightz, 0]);
    //var xAxis = d3-axis().scale(x).orient("bottom");
  //  var yAxis = d3.svg.axis().scale(y).orient("left");

    var tempData = [];
    for (var i = 0; i < datatime.length; i++) {
        for (var j = 0; j < datatime[i].length; j++) {
            tempData.push(datatime[i][j]);
        }
    }

    x.domain(d3.extent(tempData, function(d) {
        return d[0];
    }));
    y.domain(d3.extent(tempData, function(d) {
        return d[1];
    }));
    var line = d3.line()
        .x(function(d) {
            return x(d[0]);
        })
        .y(function(d) {
            return y(d[1]);
        })
      //  .interpolate("monotone");


    var paths = d3.select("g.zhexian").selectAll('.line').data(datatime);
    paths.enter().append("path").attr("class", "line").attr("d", line);
    paths.exit().remove();
}//zhexian