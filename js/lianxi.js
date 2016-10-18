/**
 * Created by xiaoguo on 2016/8/30.
 */
var chartPlot = (function() {
    chartPlot = {};

    chartPlot.seriesOptions = [];

    Highcharts.setOptions({
        lang: {
            months: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            weekdays: ['鍛ㄦ棩', '鍛ㄤ竴', '鍛ㄤ簩', '鍛ㄤ笁', '鍛ㄥ洓', '鍛ㄤ簲', '鍛ㄥ叚'],
            shortMonths: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        },
        global: {
            useUTC: false
        }
    });

    myDateFormat = {
        millisecond: '%H:%M:%S.%L',
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%b鏈�%e鏃�',
        week: '%b鏈�%e鏃�',
        month: '%Y骞�%b鏈�',
        year: '%Y骞�'
    };

    chartPlot.createChart = function() {
        $('#linechart').highcharts('StockChart', {
            chart: {
                events: {
                    click: function(event) {
                        //console.log(event.xAxis[0].value +', ' +event.yAxis[0].value);
                    }
                }
            },
            rangeSelector: {
                selected: 2,
                inputEnabled: false,
                buttons: [
                    {
                        type: 'day',
                        count: 1,
                        text: '1澶�'
                    },
                    {
                        type: 'week',
                        count: 1,
                        text: '1鍛�'
                    },
                    {
                        type: 'month',
                        count: 1,
                        text: '1鏈�'
                    }, {
                        type: 'month',
                        count: 6,
                        text: '鍗婂勾'
                    }, {
                        type: 'year',
                        count: 1,
                        text: '1骞�'
                    }, {
                        type: 'all',
                        text: '鍏ㄩ儴'
                    }
                ]
            },
            credits: {
                enabled: false
            },
            title: {
                text : '',
                floating: false
            },
            scrollbar: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            xAxis: {
                dateTimeLabelFormats: myDateFormat
            },
            yAxis: (function() {
                var result = [];
                $.each(types, function(i, type) {
                    var o = {};
                    o.gridLineColor = 'none';
                    o.min = 0;
                    o.title = {
                        text: type,
                        style: {
                            color: colors[i]
                        },
                        align: 'low'
                    };
                    o.height = 60;
                    o.top = i * 50 + 20;
                    o.offset = 0;
                    o.labels = {};
                    o.labels.enabled = false;
                    result.push(o);
                });
                return result;
            })(),
            tooltip: {
                borderColor: '#888',
                dateTimeLabelFormats: myDateFormat,
                useHTML: true,
                headerFormat: '<span><b>{point.key}</span></b><table>',
                pointFormat: '<tr><td><span style="font-weight: bold; color:{series.color}">{series.name}: </span></td><td><span style="width: 30px"><b> {point.y}</b></td><td> 寰厠/绔嬫柟绫�</span></td></tr>',
                footerFormat: '</table>',
                valueDecimals: 2
            },
            plotOptions: {
                series: {
                    dataGrouping: {
                        dateTimeLabelFormats: {
                            millisecond: ['%Y骞�%b鏈�%e鏃�, %A, %H:%M:%S', '%Y骞�%b鏈�%e鏃�, %A, %H:%M:%S'],
                            second: ['%Y骞�%b鏈�%e鏃�, %A, %H:%M:%S', '%Y骞�%b鏈�%e鏃�, %A, %H:%M:%S'],
                            minute: ['%Y骞�%b鏈�%e鏃�, %A, %H:%M:%S', '%Y骞�%b鏈�%e鏃�, %A, %H:%M:%S'],
                            hour: ['%Y骞�%b鏈�%e鏃�, %A, %H:%M:%S', '%Y骞�%b鏈�%e鏃�, %A, %H:%M:%S'],
                            day: ['%Y骞�%b鏈�%e鏃�, %A, %H:%M:%S', '%Y骞�%b鏈�%e鏃�, %A, %H:%M:%S'],
                            week: ['%Y骞�%b鏈�%e鏃�, %A, %H:%M:%S', '%Y骞�%b鏈�%e鏃�, %A, %H:%M:%S'],
                            month: ['%Y骞�%b鏈�%e鏃�, %A, %H:%M:%S', '%Y骞�%b鏈�%e鏃�, %A, %H:%M:%S'],
                            year: ['%Y骞�%b鏈�%e鏃�, %A, %H:%M:%S', '%Y骞�%b鏈�%e鏃�, %A, %H:%M:%S']
                        }
                    }
                }
            },
            navigator: {
                xAxis: {
                    dateTimeLabelFormats: myDateFormat,
                    labels: {
                        align: 'center',
                        y: 10
                    }
                },
                yAxis: {
                    height: 30
                },
                outlineColor: '#888',
                series: {
                    color: '#cbcbcb',
                    type: 'area'
                }
            },
            series: chartPlot.seriesOptions
        });
    }

    return chartPlot;

})();