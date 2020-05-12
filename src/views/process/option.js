export default {
  xAxis: {
    show: false,
    type: 'value',
    min: 0,
    max: 10
  },
  yAxis: {
    show: false,
    type: 'value',
    min: 0,
    max: 4
  },
  dataZoom: [
    {
      type: 'slider',
      show: true,
      xAxisIndex: [0],
      start: 1,
      end: 35
    }

  ],
  series: [
    {
      coordinateSystem: 'cartesian2d',
      type: 'graph',
      symbolSize: 100,
      roam: true,
      label: {
        show: true
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      edgeLabel: {
        fontSize: 20
      },
      categories: [
        {
          name: 'datasource',
          symbol: 'roundRect'
        },
        {
          name: 'service',
          symbol: 'circle'
        }
      ],
      data: [],
      links: []
    }
  ]
}
