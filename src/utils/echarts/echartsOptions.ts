import { getWaterQualityDictionaries } from '@/utils/waterUtils'
/**
 * 排名前三关联因子
 * @param Xdata
 * @param dataUp
 * @param dataDown
 * @returns
 */
export const getAlgaeBarOptions = (Xdata: string[], dataUp: (number | null)[], dataDown: (null | number)[]) => {
    return {
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: Xdata,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.5)'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    fontFamily: 'TRENDS',
                    fontSize: 18,
                    color: '#fff'
                },
                splitLine: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                data: Xdata
            }
        ],
        series: [
            {
                name: '',
                type: 'bar',
                stack: 'Total',
                barWidth: 24,
                color: '#00e87e',
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        offset: [0, -4],
                        formatter: '{c}',
                        textStyle: {
                            color: '#00e87e',
                            fontFamily: 'Furore',
                            fontSize: 16,
                        }
                    }
                },
                emphasis: {
                    focus: 'series'
                },
                data: dataUp // [320, 302, 341, 374, 390, 450, 420]
            },
            {
                name: '',
                type: 'bar',
                stack: 'Total',
                barWidth: 24,
                color: '#f2be32',
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        offset: [0, -4],
                        formatter: '{c}',
                        textStyle: {
                            color: '#f2be32',
                            fontFamily: 'Furore',
                            fontSize: 16,
                        }
                    }
                },
                emphasis: {
                    focus: 'series'
                },
                data: dataDown // [-120, -132, -101, -134, -190, -230, -210]
            }
        ]
    }
}
/**
 * 要素趋势对比
 * @param xData
 * @param Data
 * @returns
 */
export const algaeLineChartOptions = (xData: string[], seriesData: Record<string, any>[]) => {
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            show: true,
            type: 'scroll',
            itemWidth: 12,
            itemHeight: 12,
            icon: 'circle',
            bottom: 10,
            textStyle: {
                fontFamily: 'TRENDS',
                color: '#909399',
                fontSize: '12px'
            }
        },
        grid: {
            top: 60,
            left: '9%',
            right: 10,
            bottom: 40,
            containLabel: true
        },
        color: ['#2AC94F', '#FFE200', '#FF99C3', '#00FFFD', '#ff99c3', '#00fffd', '#ff7815', '#ef33ff'],
        xAxis: [
            {
                type: 'category',
                data: xData,
                boundaryGap: false,
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: '12',
                        color: 'rgba(255,255,255,0.6)'
                    }
                },
                axisTick: {
                    show: false,
                    interval: 24
                }
            }
        ],
        yAxis: [
            {
                name: '因子值\n(mg/l)',
                nameTextStyle: {
                    fontFamily: 'TRENDS',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px',
                    align: 'center'
                },
                type: 'value',
                offset: 60,
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        fontFamily: 'TRENDS',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '16px',
                        align: 'center',
                        padding: [0, 0, 0, 10]
                    }
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['transparent', 'rgba(255, 255, 255, 0.05)'],
                    },
                },
                splitLine: { show: false },
                axisTick: { show: false },
                axisPointer: {
                    snap: true
                }
            },
            {
                name: '叶绿素a\n(μg/l)',
                nameTextStyle: {
                    align: 'center',
                    fontFamily: 'TRENDS',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px'
                },
                type: 'value',
                position: 'left',
                offset: 10,
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        fontFamily: 'TRENDS',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '16px',
                        align: 'center'
                    }
                },
                splitLine: { show: false },
                axisTick: { show: false },
                axisPointer: {
                    snap: true
                }
            },
            {
                name: '水温\n(℃)',
                nameTextStyle: {
                    align: 'center',
                    fontFamily: 'TRENDS',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px',
                    padding: [0, 0, 0, 10]
                },
                type: 'value',
                position: 'right',
                offset: 10,
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        fontFamily: 'TRENDS',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '16px',
                        align: 'center'
                    }
                },
                splitLine: { show: false },
                axisTick: { show: false },
                axisPointer: {
                    snap: true
                }
            }
        ],
        series: seriesData
    }
}
/**
 * 氮磷比趋势变化
 * @param xData
 * @param data
 * @returns
 */
export const trendChangeLineOptions = (xData: string[], data: number[], echarts: any) => {
    return {
        title: {
            show: true,
            text: 'N/P（100%）',
            textAlign: 'left',
            left: 10,
            top: 14,
            textStyle: {
                color: 'rgba(255,255,255,0.6)',
                fontSize: 14,
                fontFamily: 'TRENDS'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            top: 50,
            left: 10,
            right: '1%',
            bottom: 10,
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: xData,
                axisLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: '16',
                        color: 'rgba(255,255,255,0.6)'
                    }
                },
                axisTick: {
                    show: false,
                    interval: 24
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '',
                axisLabel: {
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: 16,
                        color: 'rgba(255,255,255,0.6)',
                    },
                },
                axisLine: {
                    show: false,
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['rgba(255, 255, 255, 0.05)', 'transparent'],
                    },
                },
                splitLine: { show: false },
                axisTick: { show: false },
            },
        ],
        series: [
            {
                name: '氮磷比趋势变化',
                type: 'line',
                symbolSize: 0,
                smooth: true,
                lineStyle: {
                    color: '#47E5E5',
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#47E5E5 ' },
                            { offset: 1, color: 'rgba(71,229,229,0.06)' }
                        ]),
                    }
                },
                data
            }
        ]
    }
}

/**
 * 水质-雨量-水位趋势对比图
 * @param xData
 * @param Data
 * @returns
 */
export async function initWaterQuality(xAxis: string[], data: { hydrology: strNum[]; factorValue: strNum[]; rain: strNum[]; quality: (string | null)[] }, unit: string, factorName: string) {
    const { hydrology, factorValue, rain, quality } = data
    const gradeList = await getWaterQualityDictionaries('waterSurface')
    const option = {
        grid: {
            top: 55,
            right: 32,
            bottom: 45,
            left: 82
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            },
            textStyle: {
                color: '#b9cfe2',
                fontFamily: 'PingFang SC'
            },
            formatter: (params: any[]) => {
                let str = `<div>${params[0].axisValue}</div>`
                params.forEach((item: record, index: number) => {
                    let unit = ''
                    if (index === 0)
                        unit = 'mm/h'
                    else if (index === 1)
                        unit = 'mg/L' || ''
                    else
                        unit = 'm'

                    str += `<div>${item.marker}${item.seriesName}：${item.value ? item.value : '--'}${unit}</div>`
                })
                return str
            }
        },
        legend: {
            show: true,
            // right: 'center',
            bottom: 0,
            inactiveColor: 'rgba(255,255,255,0.5)',
            textStyle: {
                color: 'rgba(255,255,255,1)'
            },
            itemHeight: 2,
            itemWidth: 16,
            data: [
                {
                    name: '降雨量趋势',
                    icon: 'rect',
                },
                {
                    name: factorName,
                    icon: 'rect',
                },
                {
                    name: '水位趋势',
                    icon: 'rect',
                }
            ]
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                show: false,
                lineStyle: {
                    color: 'rgba(255,255,255,0.5)'
                }
            },
            axisLabel: {
                show: true,
                textStyle: {
                    fontFamily: 'Bebas Neue',
                    fontSize: '12',
                    color: 'rgba(255,255,255,0.6)'
                }
            },
            axisTick: {
                show: false
            },
            data: xAxis
        },
        yAxis: [
            {
                // 降雨量
                type: 'value',
                name: '降雨量\n(mm/h)',
                nameLocation: 'start',
                nameTextStyle: {
                    align: 'right'
                },
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        fontFamily: 'Bebas Neue',
                        fontSize: '12',
                        color: 'rgba(255,255,255,0.6)'
                    }
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                axisPointer: {
                    snap: true
                },
                splitLine: { show: false },
                axisTick: { show: false },
                inverse: true
            },
            {
                // 氨氮
                type: 'value',
                name: `监测值\n(${unit})`,
                nameTextStyle: {
                    align: 'right'
                },
                position: 'left',
                offset: 45,
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        fontFamily: 'Bebas Neue',
                        fontSize: '12',
                        color: 'rgba(255,255,255,0.6)'
                    }
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                axisPointer: {
                    snap: true
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['transparent', 'rgba(255, 255, 255, 0.05)'],
                    },
                },
                splitLine: { show: false },
                axisTick: { show: false }
            },
            {
                // 水位
                type: 'value',
                name: '水位(m)',
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        fontFamily: 'Bebas Neue',
                        fontSize: '12',
                        color: 'rgba(255,255,255,0.6)'
                    }
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                axisPointer: {
                    snap: true
                },
                splitLine: { show: false },
                axisTick: { show: false }
            }
        ],
        series: [
            {
                name: '降雨量趋势',
                type: 'line',
                // smooth: true,
                showSymbol: false,
                yAxisIndex: 0,
                lineStyle: {
                    color: 'rgba(217, 204, 76, 1)',
                    opacity: 1,
                    width: 0.5
                },
                areaStyle: {
                    color: 'rgba(217, 204, 76, .5)'
                },
                data: rain
            },
            {
                name: factorName,
                type: 'line',
                smooth: false,
                connectNulls: true,
                yAxisIndex: 1,
                symbol: 'circle',
                showSymbol: false,
                lineStyle: {
                    color: 'rgba(0, 221, 255, 1)',
                    type: 'solid'
                },
                markPoint: {
                    show: false,
                    itemStyle: {
                        color: ['#f00']
                    }
                },
                label: {
                    show: true,
                    fontFamily: 'Bebas Neue',
                    fontSize: '12',
                    color: 'rgba(255,255,255,0.6)'
                },
                // data: factorValue.map((item, index) => {
                //     return {
                //         value: item,
                //         itemStyle: {
                //             color: 'white'
                //         }
                //     }
                // })
                data: factorValue.map((item, index) => {
                    const currData = gradeList.filter(item => item.level === Number(quality[index]))
                    return {
                        value: item,
                        itemStyle: {
                            color: currData.length ? currData[0].color : '#6D7278'
                        }
                    }
                }),
                // markArea: {
                //     silent: true,
                //     data: [
                //         {
                //             name: '达标',
                //             label: {
                //                 position: 'left',
                //                 color: 'rgba(255,255,255,0.5)'
                //             },
                //             itemStyle: {
                //                 color: 'transparent',
                //                 borderColor: '#5FE81B',
                //                 borderWidth: 7
                //             },
                //             x: '96.5',
                //             yAxis: 15
                //         },
                //         { x: '96.5', yAxis: 20 }
                //     ]
                // }
            },
            {
                name: '水位趋势',
                type: 'line',
                // smooth: true,
                showSymbol: false,
                yAxisIndex: 2,
                areaStyle: {
                    color: 'rgba(238, 142, 0, .5)'
                },
                markPoint: {
                    show: false,
                },
                lineStyle: {
                    color: 'rgba(238, 142, 0, 1)',
                    opacity: 1,
                    width: 0.5
                },
                data: hydrology
            }
        ]
    }
    return option
}

/**
 * 最近7天汪家埠氨氮K线与日变化趋势图
 * @param xData
 * @param Data
 * @returns
 */
export async function dayKLine(data: {
    xAxis: strNum[]
    kData: strNum[][]
    values: strNum[]
    quality: number[]
}, min: number, max: number, factorName: string, unit: string, timeStr: string) {
    const { xAxis, kData, values, quality } = data
    const gradeList = await getWaterQualityDictionaries('waterSurface')
    const option = {
        grid: [
            {
                top: 45,
                left: 45,
                right: 32,
                height: 60
            },
            {
                left: 45,
                right: 32,
                top: 140,
                height: '20%'
            }
        ],
        tooltip: {
            link: { xAxisIndex: 'all' },
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            textStyle: {
                color: '#b9cfe2',
                fontFamily: 'PingFang SC'
            },
            formatter(param: any) {
                param = param[0]
                if (param.axisIndex === 0) {
                    return [`${param.marker + param.seriesName} ${param.name}`, `最大值 ${param.data[5]}`, `最后一个值: ${param.data[4]}`, `平均值: ${param.data[3]}`, `第一个值: ${param.data[2]}`, `最小值: ${param.data[1]}`].join('<br/>')
                }
                else {
                    const level = !quality[param.dataIndex] && quality[param.dataIndex] !== 0
                        ? '--'
                        : gradeList.find((item) => {
                            return item.level === (quality[param.dataIndex] || 1)
                        })?.name ?? ''
                    const value_ = !param.value ? '--' : param.value
                    return [`${param.marker + param.seriesName} ${param.name}`, `${factorName}：${value_}${unit}`, `水质等级：${level}`].join('<br/>')
                }
            }
        },
        // dataZoom: [
        //     {
        //         show: true,
        //         type: 'slider',
        //         height: 15,
        //         top: '90%',
        //         realtime: true,
        //         start: 0,
        //         end: 100,
        //         xAxisIndex: [0, 1],
        //         borderColor: '#3ee1f3',
        //         backgroundColor: '#00262d',
        //         handleStyle: {
        //             color: '#00cbd1'
        //         },
        //         dataBackground: {
        //             lineStyle: {
        //                 color: '#3ee1f3'
        //             },
        //             areaStyle: {
        //                 color: '#00363f'
        //             }
        //         },
        //         textStyle: {
        //             color: 'rgba(255,255,255,0.5)',
        //             fontFamily: 'Bebas Neue'
        //         }
        //     }
        // ],
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontFamily: 'Bebas Neue',
                        fontSize: '12'
                    }
                },
                axisTick: {
                    show: false
                },
                data: xAxis
            },
            {
                type: 'category',
                show: false,
                gridIndex: 1,
                boundaryGap: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                axisTick: {
                    show: false
                },
                data: xAxis
            }
        ],
        yAxis: [
            {
                // k线
                type: 'value',
                name: unit,
                nameTextStyle: {
                    align: 'right'
                },
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        fontFamily: 'Bebas Neue',
                        fontSize: '12',
                        fontWeight: 'normal'
                    }
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                axisPointer: {
                    snap: true
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['transparent', 'rgba(255, 255, 255, 0.05)'],
                    },
                },
                splitLine: { show: false },
                axisTick: { show: false },
                max,
                min
            },
            {
                // 日变化柱状图
                type: 'value',
                gridIndex: 1,
                axisLabel: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                axisPointer: {
                    snap: true
                },
                splitLine: { show: false },
                axisTick: { show: false }
            }
        ],
        series: [
            {
                name: 'K线',
                type: 'boxplot',
                yAxisIndex: 0,
                itemStyle: {
                    color: 'transparent',
                    borderColor: '#00fff5'
                },
                data: kData
            },
            {
                name: `${timeStr}变化`,
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                barWidth: 20,
                // label: {
                //     show: true,
                //     position: 'top',
                //     fontFamily: 'Bebas Neue',
                //     fontSize: '12',
                //     color: 'rgba(255,255,255,0.6)'
                // },
                itemStyle: {
                    color: (params: any) => {
                        const level = quality[params.dataIndex] // 水质等级
                        const currData = gradeList.filter((item) => {
                            return level ? Number(item.level) === Number(level.toString()) : false
                        })
                        if (level != null)
                            return currData.length ? currData[0].color : '#6D7278' // 水质等级颜色
                    }
                },
                // 等级数字转等级文字信息
                // data: values
                data: values.map((item, index) => {
                    const colorList = ['#03A9F4', '#1976D2', '#85C941', '#D9CC4C', '#EE8E00', '#E12234']
                    return {
                        value: item,
                        itemStyle: {
                            color: colorList[index]
                        }
                    }
                })
            }
        ]
    }
    return option
}

/**
 * 上游影响
 * @param xData
 * @param Data
 * @returns
 */
export async function upImpactLine(list: {
    xAxis: string[]
        data: string[]
        qualitys: string[]
}, standardValue: strNum, dataTimeStr: string, factorName: string) {
    const { xAxis, data, qualitys } = list
    const gradeList = await getWaterQualityDictionaries('waterSurface')
    const option = {
        grid: {
            top: 65,
            right: 32,
            bottom: 25,
            left: 36
        },
        title: {
            text: `${dataTimeStr + factorName}沿程变化`,
            textStyle: {
                color: '#fff',
                fontSize: 14,
                fontWeight: 'normal',
                fontFamily: 'TRENDS'
            },
            textAlign: 'center',
            left: '46%'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            },
            formatter(param: any) {
                param = param[0]
                const currData = gradeList.filter(item => item.level === Number(qualitys[param.dataIndex]))
                const color = currData.length ? currData[0].color : '#6D7278'
                const span = `<span style='display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${color};'></span>`
                return [`${param.seriesName} `, `${param.marker + param.name}：${param.value || '--'}mg/L`, `${span}水质等级：${gradeList.find((item) => {
                    return item.level === (Number(qualitys[param.dataIndex]))
                })?.name || '--'}类`].join('<br/>')
            }
        },
        legend: {
            show: false
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                show: false,
                lineStyle: {
                    color: 'rgba(255,255,255,0.5)'
                }
            },
            axisLabel: {
                formatter: (value: string, index: number) => {
                    const length = data.length
                    if (index !== length - 1 || value.length <= 6 || length === 1) return value
                    return `{a|${value}}`
                },
                textStyle: {
                    rich: {
                        a: {
                            align: 'left',
                            width: 160
                        }
                    }
                }
            },
            axisTick: {
                show: false
            },
            data: xAxis
        },
        yAxis: [
            {
                // 降雨量
                type: 'value',
                name: '监测值\n(mg/L)',
                nameTextStyle: {
                    align: 'right'
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                axisLabel: {
                    textStyle: {
                        fontFamily: 'Bebas Neue',
                        fontSize: '12',
                        fontWeight: 'normal'
                    }
                },
                axisPointer: {
                    snap: true
                },
                splitArea: {
                    interval: 2,
                    show: true,
                    areaStyle: {
                        color: ['rgba(255, 255, 255, 0.05)', 'transparent']
                    }
                },
                splitLine: { show: false },
                axisTick: { show: false },
                max: (value: { max: number }) => {
                    if (value.max > standardValue)
                        return Math.ceil(value.max)
                    else
                        return Math.ceil(Number(standardValue))
                }
            }
        ],
        series: [
            {
                name: factorName,
                type: 'line',
                smooth: false,
                yAxisIndex: 0,
                lineStyle: {
                    color: '#d0c44a',
                    opacity: 1,
                    width: 1
                },
                symbol: 'circle',
                symbolSize: 8,
                label: {
                    show: true,
                    fontFamily: 'Bebas Neue',
                    fontSize: '12',
                    color: 'rgba(255,255,255,0.6)'
                },
                data: data.map((item, index) => {
                    const currData = gradeList.filter(item => item.level === Number(qualitys[index]))
                    return {
                        value: item,
                        itemStyle: {
                            color: currData.length ? currData[0].color : '#6D7278'
                        }
                    }
                }),
                markLine: {
                    type: 'average',
                    lineStyle: {
                        color: '#FF1744'
                    },
                    symbol: 'none',
                    data: [
                        {
                            yAxis: standardValue,
                            name: '水质超标线',
                            label: {
                                show: true,
                                formatter: '{b}',
                                position: 'end',
                                distance: -70,
                                fontSize: 12,
                                lineHeight: 17,
                                padding: [0, 6, 0, 6],
                                color: '#FFFFFF',
                                backgroundColor: '#FF1744',
                                borderRadius: 8
                            },
                            lineStyle: {
                                type: 'solid',
                                width: 2,
                                color: '#FF1744'
                            }
                        }
                    ]
                }
            }
        ]
    }
    return option
}
/**
 * 叶绿素a沿程变化
 * @param xData
 * @param data
 * @returns
 */
export const upstreamSectionOptions = (xData: string[], data: number[] | string[], limit: number) => {
    return {
        title: {
            show: true,
            text: '单位：μg/L',
            textAlign: 'left',
            left: 10,
            top: 10,
            textStyle: {
                color: 'rgba(255,255,255,0.6)',
                fontSize: 12,
                fontFamily: 'TRENDS'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line', // 默认为直线，可选为：'line' | 'shadow'
            },
        },
        grid: {
            top: 50,
            left: 10,
            right: '1%',
            bottom: 20,
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: xData,
                axisLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: '12',
                        color: 'rgba(255,255,255,1)'
                    }
                },
                axisTick: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '',
                axisLabel: {
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: 16,
                        color: 'rgba(255,255,255,0.6)',
                    },
                },
                axisLine: {
                    show: false,
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['rgba(255, 255, 255, 0.05)', 'transparent'],
                    },
                },
                splitLine: { show: false },
                axisTick: { show: false },
            },
        ],
        series: [
            {
                name: '沿程变化',
                type: 'line',
                data,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    color: '#fff'
                },
                itemStyle: {
                    color: (params: Record<string, any>) => {
                        return params.value > limit ? '#f54455' : '#1492E6'
                    }
                },
                markLine: {
                    symbol: 'none',
                    type: 'average',
                    data: [
                        {
                            name: '超标线',
                            lineStyle: {
                                type: 'solid',
                                color: '#f54455'
                            },
                            label: {
                                position: 'end',
                                formatter: '{b}',
                                distance: -50,
                                backgroundColor: '#f54455',
                                color: '#fff',
                                borderRadius: 20,
                                padding: [3, 7]
                            },
                            yAxis: limit
                        },
                    ]
                },
            }
        ]
    }
}

export const pollutionSourcePieOptions = (pieData: Record<string, any>[]) => {
    return {
        grid: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
        color: ['#F84439', '#0062FF', '#2AC94F'],
        series: [
            {
                name: '企业档案',
                type: 'pie',
                center: ['50%', '50%'],
                radius: ['60%', '100%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                data: pieData,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            }
        ]
    }
}
/**
 * 无人船巡航折线图
 * @param dataJson json
 * @returns options
 */
export const waterQualityLineOptions = (name: string, showMult: boolean, xdata: string[], visualMap: Record<string, any>[], seriesArr: Record<string, any>[]) => {
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            top: 30,
            left: 40,
            right: 40,
            bottom: 30
        },
        xAxis: [
            {
                type: 'category',
                data: xdata,
                axisLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: '12',
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                axisTick: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name,
                axisLabel: {
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.5)',
                    },
                },
                axisLine: {
                    show: false,
                },
                splitArea: {
                    show: false,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                axisTick: { show: false },
            },
            {
                type: 'value',
                name: 'NTU',
                show: showMult,
                axisLabel: {
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.5)',
                    },
                },
                axisLine: {
                    show: false,
                },
                splitArea: {
                    show: false,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                axisTick: { show: false },
            },
        ],
        visualMap,
        series: seriesArr
    }
}
/**
 * @name: 污染源弹框echarts
 */
export const mapSwagePointPopLineOptions = (xData: string[], data: (null | { value: number | null; overProof?: boolean | null })[][], factorData: {
    name: string
    unit: string
    }, markLineData: any[], timeStr: string) => {
    const { unit } = factorData
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            },
        },
        grid: {
            top: 30,
            left: 45,
            right: 40,
            bottom: 30
        },
        xAxis: [
            {
                type: 'category',
                data: xData,
                axisLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: '12',
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                axisTick: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: `${timeStr}${unit ? `(${unit})` : ''}`,
                axisLabel: {
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: 12,
                        color: 'rgba(255, 255, 255, 0.5)'
                    },
                },
                position: 'left',
                nameTextStyle: {
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontFamily: 'TRENDS',
                    fontSize: 12
                },
                axisLine: {
                    show: false,
                },
                splitArea: {
                    show: false,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                axisTick: { show: false },
            },
            {
                type: 'value',
                name: '排放量（kg）',
                nameTextStyle: {
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontFamily: 'TRENDS',
                    fontSize: 12
                },
                position: 'right',
                axisLabel: {
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: 12,
                        color: 'rgba(255, 255, 255, 0.5)'
                    },
                },
                axisLine: {
                    show: false,
                },
                splitArea: {
                    show: false,
                },
                splitLine: {
                    show: false,
                },
                axisTick: { show: false },
            },
        ],
        series: [
            {
                name: `${timeStr}${unit ? `（${unit}）` : ''}`,
                type: 'bar',
                barWidth: 9,
                yAxisIndex: 0,
                data: data[0].map((item) => {
                    return item ? item.value : item
                }),
                itemStyle: {
                    color: (params: any) => {
                        const dataIndex = params.dataIndex
                        if (data[0][dataIndex]?.overProof) return 'rgba(244, 67, 54, 1)'
                        return '#00DDFF'
                    }
                },
                markLine: {
                    data: markLineData
                }
            },
            {
                name: '排放量(kg)',
                type: 'line',
                symbol: 'none',
                yAxisIndex: 1,
                smooth: true,
                data: data[1].map((item) => {
                    return item ? item.value : item
                }),
                lineStyle: {
                    color: '#F84439'
                },
                itemStyle: {
                    color: 'rgba(244, 67, 54, 1)'
                },
                markLine: {
                    data: markLineData
                }
            }
        ]
    }
}
/**
 * @name: 年度任务-污水直排
 */
export const getYearTaskOption = (pieData: { name: string; value: number; rate: string }[], count: number) => {
    const chartOption = {
        grid: {
            top: 0,
            left: 55,
            bottom: '1%',
        },
        color: ['#2AC94F', '#FFB443'],
        legend: {
            type: 'scroll',
            orient: 'vertical',
            itemGap: 8,
            left: '15%',
            top: '65%',
            itemWidth: 10,
            itemHeight: 10,
            icon: 'circle',
            data: pieData,
            formatter: (name: string) => {
                return `{name|${name}}{num1|${pieData[0].value}}{rate|${pieData[0].rate}}`
            },
            textStyle: {
                rich: {
                    name: {
                        width: 40,
                        fontSize: 14,
                        color: 'rgba(255,255,255,.5)',
                        fontFamily: 'TRENDS'
                    },
                    num1: {
                        fontSize: 12,
                        color: '#00DDFF',
                        width: 40,
                        align: 'right',
                        fontFamily: 'Furore'
                    },
                    rate: {
                        fontSize: 12,
                        fontWeight: 'normal',
                        color: 'rgba(255,255,255,1)',
                        width: 15,
                        align: 'center',
                        fontFamily: 'Furore'
                    },
                }
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: (params: {
                data: {
                    name: string
                    value: string
                    rate: string
                }
            }) => {
                const {
                    data: { name, value, rate }
                } = params
                return `${name}：${value}家(${rate})`
            }
        },
        graphic: [ // 设置饼图中间文字内容
            {
                type: 'text',
                left: 'center', // center不行 因为会飞到整个div的中间
                top: '26%',
                style: {
                    text: count,
                    textAlign: 'center',
                    fontWeight: 'normal',
                    fill: 'rgba(255,255,255,.85)',
                    fontSize: 24,
                    fontFamily: 'Oswald'
                }
            }
        ],
        series: [
            {
                name: '企业档案',
                type: 'pie',
                center: ['50%', '33%'],
                radius: ['35%', '50%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                data: pieData,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            }
        ]
    }
    return chartOption
}
/**
 * @name: 地表水弹框echarts
 */
export const mapPointPopLineOptions = async (xData: string[], yData: { level: number | null; value?: number | null }[], factorData: {
    name: string
    unit: string
    isGroup: boolean
    }, markLineData: any[], pieces?: { min: number | null; max: number | null; color: string }[]) => {
    const { name, unit, isGroup } = factorData
    let max
    let min
    const gradesList = await getWaterQualityDictionaries('waterSurface') || []
    const markList: number[] = markLineData.map(item => item.yAxis)
    const yDataUse = yData.map((item) => {
        if (isGroup) return item.level
        else return item.value
    }) || []
    const yNum = yDataUse.filter(item => typeof item === 'number') as number[]
    const yMax = Math.max(...yNum)
    const yMin = Math.min(...yNum)
    const markMax = Math.max(...markList)
    const markMin = Math.min(...markList)
    if (markMax > yMax) max = markMax
    if (markMin < yMin) min = markMin
    return {
        title: {
            text: unit,
            left: '0',
            textStyle: {
                color: 'rgba(255,255,255,0.5)',
                fontSize: 12,
                fontFamily: 'TRENDS'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            },
            formatter: (params: any) => {
                params = params[0]
                let str = `${params.axisValueLabel}<br/>`
                let value = params.value
                if (isGroup)
                    value = gradesList.find(item => item.level === value)?.name ?? ''

                str += `${params.marker + name}：${value || '--'}${unit}<br/>`
                return str
            }
        },
        grid: {
            top: 30,
            left: 40,
            right: 10,
            bottom: 30
        },
        xAxis: [
            {
                type: 'category',
                data: xData,
                axisLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: '12',
                        color: 'rgba(255,255,255,0.5)'
                    },
                    formatter: (value: any) => {
                        if (xData.length > 12)
                            return value.slice(-2)

                        return value
                    }
                },
                axisTick: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '',
                axisLabel: {
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: 12,
                        color: 'rgba(255, 255, 255, 0.5)'
                    },
                    formatter: (value: any) => {
                        if (isGroup) {
                            const currData = gradesList.filter(item => item.level === value || item.value === value)
                            const returnData = currData.length ? currData[0].name : ''
                            return returnData
                        }
                        return value
                    }
                },
                axisLine: {
                    show: false,
                },
                splitArea: {
                    show: false,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                axisTick: { show: false },
                max,
                min,
            },
        ],
        visualMap: {
            top: 50,
            right: 10,
            show: false,
            seriesIndex: 0, // 第一部分数据
            pieces,
            outOfRange: {
                color: '#999'
            }
        },
        series: {
            name,
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            connectNulls: true, // 断线连接
            showAllSymbol: true, // auto 默认，如果有足够空间则显示标志图形，否则随主轴标签间隔隐藏策略。 true 显示所有图形。 false 随主轴标签间隔隐藏策略。
            smooth: true,
            data: yDataUse,
            markLine: {
                data: markLineData
            }
        }
    }
}
/**
 * @name: 河道智治
 * @param {function} dataJson
 * @return {*}
 */
export const RiverRuleLineOptions = (dataJson: (string | number)[][]) => {
    return {
        title: {
            text: 'mg/L',
            left: '20',
            textStyle: {
                color: 'rgba(255,255,255,0.5)',
                fontSize: 12,
                fontFamily: 'TRENDS'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            top: 30,
            left: 45,
            right: 0,
            bottom: 30
        },
        xAxis: [
            {
                type: 'category',
                data: dataJson.map((item) => {
                    return item[0]
                }),
                axisLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: '12',
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                axisTick: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '',
                axisLabel: {
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.5)',
                    },
                },
                axisLine: {
                    show: false,
                },
                splitArea: {
                    show: false,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                axisTick: { show: false },
            },
        ],
        visualMap: {
            top: 50,
            right: 10,
            show: false,
            pieces: [
                {
                    gt: 0,
                    lte: 0.15,
                    color: '#03A9F4'
                },
                {
                    gt: 0.15,
                    lte: 0.5,
                    color: '#1976D2'
                },
                {
                    gt: 0.5,
                    lte: 1,
                    color: '#85C941'
                },
                {
                    gt: 1,
                    lte: 1.5,
                    color: '#D9CC4C'
                },
                {
                    gt: 1.5,
                    lte: 2,
                    color: '#FF8330'
                },
                {
                    gt: 2,
                    color: '#E12234'
                }
            ],
            outOfRange: {
                color: '#999'
            }
        },
        series: {
            name: '氨氮',
            type: 'bar',
            symbolSize: 0,
            smooth: true,
            data: dataJson.map((item) => {
                return item[1]
            }),
        }
    }
}

/**
 * 基础柱状图配置
 */
export const baseChartOptions = (time: string, unit: string, xdata: string[], seriesData: number[]) => {
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            },
            formatter(params: Record<string, any>) {
                const value = params[0].value === 0 ? 0 : params[0].value ? params[0].value : '--'
                const htmlStr = `<div>
                    <div>${time} ${params[0].axisValue}<div>
                    <div>
                        ${params[0].marker}
                        <span>${value}${unit}</span>
                    </div>
                </div>`
                return htmlStr
            }
        },
        grid: {
            top: 10,
            left: 20,
            right: 10,
            bottom: 5,
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: xdata,
                axisLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: '12',
                        color: 'rgba(255,255,255,1)'
                    }
                },
                axisTick: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '',
                axisLabel: {
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.5)',
                    },
                },
                axisLine: {
                    show: false,
                },
                splitArea: {
                    show: false,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                axisTick: { show: false },
            },
        ],
        series: {
            name: '',
            type: 'bar',
            barWidth: 8,
            itemStyle: {
                color: '#85C941'
            },
            data: seriesData
        }
    }
}

/**
 * @name: 雨量监测
 * @param {string} xData
 * @param {number} yData
 */
export const getChartRainOption = (xData: string[], yData: number[]) => {
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter(params: any) {
                const str = `<div><div>${params[0].axisValue}</div><div style='display: flex;height:20px;align-items:center;'>${params[0].marker}
                                <div>${params[0].data}${params[0].seriesName}</div></div>`
                return str
            }
        },
        color: ['#03d5fb'],
        grid: {
            top: '20',
            left: '30',
            bottom: '35',
            right: '10'
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#ffffff',
                    fontSize: 14,
                    interval: 0,
                    fontFamily: 'TRENDS'
                },
                axisLine: {
                    lineStyle: {
                        color: '#038b8f'
                    }
                },
                data: xData
            }
        ],
        yAxis: [
            {
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    // x轴竖线
                    lineStyle: {
                        color: 'rgba(255,255,255,.2)'
                        // type: 'dashed',
                    },
                },
                axisLabel: {
                    color: 'rgba(255,255,255,0.5)',
                    fontFamily: 'TRENDS',
                    fontSize: 12,
                }
            }
        ],
        series: [
            {
                name: 'mm',
                type: 'bar',
                barWidth: 13,
                data: yData,
            }
        ]
    }
    return option
}
/**
 * @name: 水球图
 */
export const getBallWaterOption = () => {
    // 指定图表的配置项和数据
    const option = {
        // backgroundColor: '#050038',
        title: {
            text: '小型水库',
            left: '20%',
            top: '23%',
            textStyle: {
                fontWeight: 'normal',
                fontSize: 16,
                fontFamily: 'TRENDS',
                color: 'rgba(255, 255, 255, 0.8)'
            }
        },
        series: [{
            type: 'liquidFill',
            radius: '92%',
            center: ['50%', '50%'],
            data: [0.5, 0.5, 0.5],
            borderWidth: 0,
            outline: {
                show: true,
                borderDistance: 4, // 边距和圆的间距
                itemStyle: {
                    color: 'none',
                    borderColor: 'rgba(2, 198, 252, .5)',
                    borderWidth: 2,
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.25)'
                }
            },
            backgroundStyle: {
                color: 'rgba(2,156,252,.2)' // 球背景颜色
            },
            itemStyle: {
                color: 'rgba(0, 175, 223, 1)' // 设置中间波澜颜色
            },
            label: {
                position: ['50%', '60%'],
                formatter: `${50}%`,
                color: 'white',
                textStyle: {
                    fontFamily: 'Furore',
                    fontSize: 24
                }
            },
        }
        ]
    }
    return option
}

/**
 * @name: 洪水预报
 * @param {string} xData
 * @param {number} yData
 */
export const getFloodForecastOption = (xData: string[], yData: number[]) => {
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter(params: any) {
                const str = `<div><div>${params[0].axisValue}</div><div style='display: flex;height:20px;align-items:center;'>${params[0].marker}
                                <div>${params[0].data}${params[0].seriesName}</div></div>`
                return str
            }
        },
        color: ['#03d5fb'],
        grid: {
            top: '16',
            left: '30',
            bottom: '30',
            right: '10'
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#ffffff',
                    fontSize: 14,
                    interval: 0,
                    fontFamily: 'TRENDS'
                },
                axisLine: {
                    lineStyle: {
                        color: '#038b8f'
                    }
                },
                data: xData
            }
        ],
        yAxis: [
            {
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    // x轴竖线
                    lineStyle: {
                        color: 'rgba(255,255,255,.2)'
                        // type: 'dashed',
                    },
                },
                axisLabel: {
                    color: 'rgba(255,255,255,0.5)',
                    fontFamily: 'TRENDS',
                    fontSize: 12,
                }
            }
        ],
        series: [
            {
                name: 'mm',
                type: 'line',
                smooth: true, // 折线平滑
                barWidth: 13,
                data: yData,
                symbolSize: 'none', // 设定拐点的大小
                itemStyle: {
                    show: false

                },
                lineStyle: {
                    // 设置折线颜色
                    color: '#00DDFF'
                },
                areaStyle: {
                    // 阴影颜色渐变
                    normal: {
                        color: {
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: 'rgba(0, 221, 255, 0.7)' // 100% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(0, 221, 255, 0)' // 0% 处的颜色
                                }
                            ],
                            globalCoord: false, // 缺省为 false
                        }
                    }
                },
                markLine: {
                    symbol: 'none', // 去掉箭头
                    data: [
                        {
                            yAxis: 5.66,
                            name: '5.66m',
                            label: {
                                show: true,
                                formatter: '{b}',
                                position: 'insideEndBottom',
                                // distance: -35,
                                fontSize: 12,
                                lineHeight: 15,
                                fontFamily: 'Furore',
                                // padding: [40, 0, 0, 0],
                                color: 'rgba(255, 153, 2, 1)',
                                // borderRadius: 8
                            },
                            lineStyle: {
                                type: 'dashed',
                                color: 'rgba(255, 153, 2, 1)',
                                width: 2
                            }
                        },
                        {
                            yAxis: 6.66,
                            name: '6.66m',
                            label: {
                                show: true,
                                formatter: '{b}',
                                position: 'insideEndTop',
                                fontSize: 12,
                                lineHeight: 15,
                                color: 'rgba(248, 68, 57, 1)',
                                fontFamily: 'Furore'
                            },
                            lineStyle: {
                                type: 'dashed',
                                color: 'rgba(248, 68, 57, 1)',
                                width: 2
                            }
                        },
                        {
                            yAxis: 2,
                            name: '2m',
                            label: {
                                show: false,
                            },
                            lineStyle: {
                                type: 'dashed',
                                color: 'white',
                                width: 2
                            }
                        }
                    ]
                }

            }
        ]
    }
    return option
}

/**
 * 降雨预报
 * @param xData
 * @param Data
 * @returns
 */
export function rainfallForecastChartOption(xAxis: string[], data: { temperature: strNum[];rain: strNum[] }) {
    const { temperature, rain } = data
    const option = {
        grid: {
            top: 40,
            right: 32,
            bottom: 50,
            left: 30
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            },
            textStyle: {
                color: '#b9cfe2',
                fontFamily: 'PingFang SC'
            },
            formatter: (params: any[]) => {
                let str = `<div>${params[0].axisValue}</div>`
                params.forEach((item: record, index: number) => {
                    let unit = ''
                    if (index === 0)
                        unit = 'mm'
                    else if (index === 1)
                        unit = '°C'
                    str += `<div>${item.marker}${item.seriesName}：${item.value ? item.value : '--'}${unit}</div>`
                })
                return str
            }
        },
        legend: {
            show: true,
            bottom: 5,
            inactiveColor: 'rgba(255,255,255,0.5)',
            textStyle: {
                color: 'rgba(255,255,255,1)'
            },
            itemHeight: 8,
            itemWidth: 8,
            data: [
                {
                    name: '温度',
                    icon: 'circle',
                },
                {
                    name: '降雨量',
                    icon: 'circle',
                }
            ]
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                show: false,
                lineStyle: {
                    color: 'rgba(255,255,255,0.5)'
                }
            },
            axisLabel: {
                show: true,
                textStyle: {
                    fontFamily: 'TRENDS',
                    fontSize: '12',
                    color: 'rgba(255,255,255,0.5)'
                },
                formatter: (value: string) => {
                    return value.slice(-2)
                }
            },
            axisTick: {
                show: false
            },
            data: xAxis
        },
        yAxis: [
            {
                type: 'value',
                name: '°C',
                // nameLocation: 'start',
                splitNumber: 3, // 横线数
                nameTextStyle: {
                    align: 'right',
                    padding: [0, 0, -0, 0]
                },
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: '12',
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                axisPointer: {
                    snap: true
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,.2)'
                        // type: 'dashed',
                    },
                },
                axisTick: { show: false },
            },
            {
                type: 'value',
                name: 'mm',
                splitNumber: 3, // 横线数
                nameTextStyle: {
                    align: 'left',
                    padding: [0, 0, 0, 0]
                },
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        fontFamily: 'Bebas Neue',
                        fontSize: '12',
                        color: 'rgba(255,255,255,0.6)'
                    }
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                axisPointer: {
                    snap: true
                },
                splitLine: { show: false },
                axisTick: { show: false }
            }
        ],
        series: [
            {
                name: '温度',
                type: 'line',
                showSymbol: false, // 不显示点
                yAxisIndex: 0,
                lineStyle: {
                    color: 'rgba(255, 180, 67, 1)',
                    opacity: 1,
                    width: 2
                },
                itemStyle: {
                    color: 'rgba(255, 180, 67, 1)',
                },
                data: temperature
            },
            {
                name: '降雨量',
                type: 'bar',
                yAxisIndex: 1,
                markPoint: {
                    show: false,
                },
                itemStyle: {
                    color: 'rgba(0, 221, 255, 1)',
                    width: 0.5
                },
                data: rain
            }
        ]
    }
    return option
}

/**
 * 河道水位
 * @param xData
 * @param Data
 * @returns
 */
export function riverWaterLevelChartOption(xAxis: string[], data: { label: string; data: number[] }[]) {
    const option = {
        grid: {
            top: 40,
            right: 20,
            bottom: 30,
            left: 35
        },
        color: ['rgba(0, 221, 255, 1)', 'rgba(42, 201, 79, 1)', 'rgba(255, 180, 67, 1)', 'rgba(248, 68, 57, 1)'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            },
            textStyle: {
                color: '#b9cfe2',
                fontFamily: 'PingFang SC'
            },
            formatter: (params: any[]) => {
                let str = `<div>${params[0].axisValue}</div>`
                params.forEach((item: record, index: number) => {
                    const unit = 'mm'
                    str += `<div>${item.marker}${item.seriesName}：${item.value ? item.value : '--'}${unit}</div>`
                })
                return str
            }
        },
        legend: {
            show: true,
            top: 8,
            right: 30,
            inactiveColor: 'rgba(255,255,255,0.5)',
            textStyle: {
                color: 'rgba(255,255,255,1)'
            },
            itemHeight: 8,
            itemWidth: 8,
            data: data.map((item) => {
                return {
                    name: item.label,
                    icon: 'circle',
                }
            })
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                show: false,
                lineStyle: {
                    color: 'rgba(255,255,255,0.5)'
                }
            },
            axisLabel: {
                show: true,
                textStyle: {
                    fontFamily: 'TRENDS',
                    fontSize: '12',
                    color: 'rgba(255,255,255,0.5)'
                },
                // formatter: (value: string) => {
                //     return value.slice(-2)
                // }
            },
            axisTick: {
                show: false
            },
            data: xAxis
        },
        yAxis: [
            {
                type: 'value',
                name: 'm',
                splitNumber: 3, // 横线数
                nameTextStyle: {
                    align: 'right',
                    padding: [0, 0, -0, 0]
                },
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: '12',
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                axisPointer: {
                    snap: true
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,.2)'
                        // type: 'dashed',
                    },
                },
                axisTick: { show: false },
            }
        ],
        series: data.map((item) => {
            return {
                name: item.label,
                type: 'line',
                showSymbol: false, // 不显示点
                data: item.data
            }
        })
    }
    return option
}

/**
 * 积水监测
 * @param xData
 * @param Data
 * @returns
 */
export function PondingMonitoringRiverChartOption(xAxis: string[], data: { temperature: strNum[];rain: strNum[] }) {
    const { temperature, rain } = data
    const option = {
        grid: {
            top: 40,
            right: 32,
            bottom: 50,
            left: 30
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            },
            textStyle: {
                color: '#b9cfe2',
                fontFamily: 'PingFang SC'
            },
            formatter: (params: any[]) => {
                let str = `<div>${params[0].axisValue}</div>`
                params.forEach((item: record, index: number) => {
                    const unit = 'mm'
                    str += `<div>${item.marker}${item.seriesName}：${item.value ? item.value : '--'}${unit}</div>`
                })
                return str
            }
        },
        legend: {
            show: true,
            bottom: 5,
            inactiveColor: 'rgba(255,255,255,0.5)',
            textStyle: {
                color: 'rgba(255,255,255,1)'
            },
            itemHeight: 8,
            itemWidth: 8,
            data: [
                {
                    name: '五常街道下穿通道',
                    icon: 'circle',
                },
                {
                    name: '余杭街道下穿通道',
                    icon: 'circle',
                }
            ]
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                show: false,
                lineStyle: {
                    color: 'rgba(255,255,255,0.5)'
                }
            },
            axisLabel: {
                show: true,
                textStyle: {
                    fontFamily: 'TRENDS',
                    fontSize: '12',
                    color: 'rgba(255,255,255,0.5)'
                },
                formatter: (value: string) => {
                    return value.slice(-2)
                }
            },
            axisTick: {
                show: false
            },
            data: xAxis
        },
        yAxis: [
            {
                type: 'value',
                name: '水尺（m）',
                splitNumber: 3, // 横线数
                nameTextStyle: {
                    align: 'right',
                    padding: [0, -40, 0, 0]
                },
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        fontFamily: 'TRENDS',
                        fontSize: '12',
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                axisPointer: {
                    snap: true
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,.2)'
                    },
                },
                axisTick: { show: false },
            }
        ],
        series: [
            {
                name: '五常街道下穿通道',
                type: 'line',
                connectNulls: true, // 断线连接
                smooth: true,
                showSymbol: false, // 不显示点
                lineStyle: {
                    color: 'rgba(255, 180, 67,.6)',
                    opacity: 1,
                    width: 2
                },
                itemStyle: {
                    color: 'rgba(255, 180, 67, 1)',
                },
                data: temperature
            },
            {
                name: '余杭街道下穿通道',
                type: 'line',
                showSymbol: false,
                connectNulls: true, // 断线连接
                smooth: true, // 不显示点
                markPoint: {
                    show: false,
                },
                lineStyle: {
                    color: 'rgba(0, 221, 255, 1)',
                    opacity: 1,
                    width: 2
                },
                itemStyle: {
                    color: 'rgba(0, 221, 255, 1)',
                },
                areaStyle: {
                    // 阴影颜色渐变
                    normal: {
                        color: {
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: 'rgba(0, 221, 255, 1)' // 100% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(0, 221, 255, 0.06)' // 0% 处的颜色
                                }
                            ],
                            globalCoord: false, // 缺省为 false
                        }
                    }
                },
                data: rain
            }
        ]
    }
    return option
}
/**
 * 用水统计
 * @param pieData
 * @param count
 * @returns
 */
export const getWaterStatisticsOption = (pieData: { name: string; value: number; rate: string }[], count: number) => {
    const chartOption = {
        grid: {
            top: 0,
            left: 55,
            bottom: '1%',
        },
        color: ['#0062FF', '#2AC94F', '#FFB443', '#F84439', '#A162F7'],
        legend: {
            type: 'scroll',
            orient: 'vertical',
            itemGap: 12,
            right: '0%',
            left: '37%',
            top: 'center',
            itemWidth: 10,
            itemHeight: 10,
            icon: 'circle',
            data: pieData,
            formatter: (name: string) => {
                for (let i = 0; i < pieData.length; i++) {
                    if (name === pieData[i].name) {
                        const richText = `{name|${name}}{num|${pieData[i].value}}{label|${'/'}}{rate|${pieData[i].rate}}{rateUnit|%}`
                        return richText
                    }
                }
            },
            textStyle: {
                rich: {
                    name: {
                        width: 95,
                        fontSize: 14,
                        color: '#FFFFFF',
                        fontFamily: 'TRENDS'
                    },
                    num: {
                        fontSize: 14,
                        color: '#00DDFF',
                        width: 50,
                        align: 'right',
                        fontFamily: 'Furore'
                    },
                    label: {
                        fontSize: 14,
                        fontWeight: 'normal',
                        color: 'rgba(255,255,255,.5)',
                        width: 12,
                        textAlign: 'center',
                        fontFamily: 'Furore'
                    },
                    rate: {
                        fontSize: 14,
                        padding: [0, 0, 0, 3],
                        align: 'right',
                        width: 30,
                        fontFamily: 'Furore',
                        color: '#00DDFF'
                    },
                    rateUnit: {
                        fontSize: 14,
                        padding: [0, 0, 0, 3],
                        align: 'left',
                        fontFamily: 'Furore',
                        color: 'rgba(255,255,255,1)'
                    }
                }
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: (params: {
                data: {
                    name: string
                    value: string
                    rate: string
                }
            }) => {
                const {
                    data: { name, value, rate }
                } = params
                return `${name}：${value}家(${rate})`
            }
        },
        graphic: [ // 设置饼图中间文字内容
            {
                type: 'text',
                left: '9%', // center不行 因为会飞到整个div的中间
                top: '38%',
                style: {
                    text: count,
                    textAlign: 'center',
                    fontWeight: 'normal',
                    fill: 'rgba(255,255,255,1)',
                    fontSize: 20,
                    fontFamily: 'Furore'
                }
            },
            {
                type: 'text',
                left: '12%', // center不行 因为会飞到整个div的中间
                top: '55%',
                style: {
                    text: '万m³',
                    textAlign: 'center',
                    fontWeight: 'normal',
                    fill: 'rgba(255,255,255, 0.85)',
                    fontSize: 16,
                    fontFamily: 'TRENDS'
                }
            }
        ],
        series: [
            {
                name: '企业档案',
                type: 'pie',
                center: ['17%', '50%'],
                radius: ['50%', '65%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                data: pieData,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            }
        ]
    }
    return chartOption
}
/**
 * @name: 清水亲码
 */
export const getQinShuiOption = (pieData: { name: string; value: number; rate: string }[], count: number, title: string) => {
    const chartOption = {
        title: {
            show: true,
            text: title,
            textAlign: 'center',
            left: '50%',
            top: -5,
            textStyle: {
                color: 'white',
                fontSize: 14,
                fontFamily: 'TRENDS'
            }
        },
        grid: {
            top: 0,
            left: 55,
            bottom: '1%',
        },
        color: ['#2AC94F', '#FFB443'],
        legend: {
            type: 'scroll',
            orient: 'vertical',
            itemGap: 8,
            left: '15%',
            top: '71%',
            itemWidth: 10,
            itemHeight: 10,
            icon: 'circle',
            data: pieData,
            formatter: (name: string) => {
                return `{name|${name}}{num1|${pieData[0].value}}{rate|/${pieData[0].rate}}`
            },
            textStyle: {
                rich: {
                    name: {
                        width: 40,
                        fontSize: 14,
                        color: 'rgba(255,255,255,.5)',
                        fontFamily: 'TRENDS'
                    },
                    num1: {
                        fontSize: 12,
                        color: '#00DDFF',
                        width: 40,
                        align: 'right',
                        fontFamily: 'Furore'
                    },
                    rate: {
                        fontSize: 12,
                        fontWeight: 'normal',
                        color: 'rgba(255,255,255,1)',
                        width: 15,
                        align: 'center',
                        fontFamily: 'Furore'
                    },
                }
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: (params: {
                data: {
                    name: string
                    value: string
                    rate: string
                }
            }) => {
                const {
                    data: { name, value, rate }
                } = params
                return `${name}：${value}家(${rate})`
            }
        },
        graphic: [ // 设置饼图中间文字内容
            {
                type: 'text',
                left: 'center', // center不行 因为会飞到整个div的中间
                top: '33%',
                style: {
                    text: count,
                    textAlign: 'center',
                    fontWeight: 'normal',
                    fill: 'rgba(255,255,255,.85)',
                    fontSize: 24,
                    fontFamily: 'Oswald'
                }
            }
        ],
        series: [
            {
                name: '企业档案',
                type: 'pie',
                center: ['50%', '40%'],
                radius: ['35%', '50%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                data: pieData,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            }
        ]
    }
    return chartOption
}

/**
 * @name: 洪水预报
 * @param {string} xData
 * @param {number} yData
 */
export const getWaterQualityRateOption = (xData: string[], yData: number[]) => {
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter(params: any) {
                const str = `<div><div>${params[0].axisValue}</div><div style='display: flex;height:20px;align-items:center;'>${params[0].marker}
                                <div>${params[0].data}${params[0].seriesName}</div></div>`
                return str
            }
        },
        color: ['#36F097'],
        grid: {
            top: '30',
            left: '30',
            bottom: '30',
            right: '10'
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#ffffff',
                    fontSize: 14,
                    interval: 0,
                    fontFamily: 'TRENDS'
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                data: xData
            }
        ],
        yAxis: [
            {
                name: '%',
                nameTextStyle: {
                    fontFamily: 'TRENDS',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '12px',
                    align: 'right'
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    // x轴竖线
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.2)'
                        // type: 'dashed',
                    },
                },
                axisLabel: {
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontFamily: 'TRENDS',
                    fontSize: 12,
                }
            }
        ],
        series: [
            {
                name: '%',
                type: 'line',
                barWidth: 13,
                data: yData,
                symbolSize: 'none', // 设定拐点的大小
                itemStyle: {
                    show: false

                },
                lineStyle: {
                    // 设置折线颜色
                    color: '#36F097'
                },
                areaStyle: {
                    // 阴影颜色渐变
                    normal: {
                        color: {
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: 'rgba(54, 240, 151, 0.6)' // 100% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(0, 221, 255, 0)' // 0% 处的颜色
                                }
                            ],
                            globalCoord: false, // 缺省为 false
                        }
                    }
                },
            }
        ]
    }
    return option
}
/**
 * @name: 水环境质量-闭环管理
 * @param {string} pieData
 * @param {number} count
 */
export const getWaterQualityCloseOption = (pieData: { name: string; value: number; rate: string }[], count: number) => {
    const chartOption = {
        title: {
            text: `{name|问题}{num|${count}}`,
            right: '7%',
            top: '15%',
            textStyle: {
                rich: {
                    name: {
                        width: 85,
                        fontSize: 14,
                        color: '#FFFFFF',
                        fontFamily: 'TRENDS'
                    },
                    num: {
                        width: 62,
                        fontSize: 14,
                        align: 'right',
                        color: '#FFFFFF',
                        fontFamily: 'Furore'
                    },
                }
            }
        },
        grid: {
            top: 0,
            left: 55,
            bottom: '1%',
        },
        color: ['#F84439', '#36F097'],
        legend: {
            type: 'scroll',
            orient: 'vertical',
            itemGap: 13,
            left: '40%',
            top: '42%',
            itemWidth: 10,
            itemHeight: 10,
            icon: 'circle',
            data: pieData,
            formatter: (name: string) => {
                for (let i = 0; i < pieData.length; i++) {
                    if (name === pieData[i].name) {
                        const richText = `{name|${name}}{num|${pieData[i].value}}{label|${'/'}}{rate|${pieData[i].rate}}`
                        return richText
                    }
                }
            },
            textStyle: {
                rich: {
                    name: {
                        width: 85,
                        fontSize: 14,
                        color: '#FFFFFF',
                        fontFamily: 'TRENDS'
                    },
                    num: {
                        fontSize: 14,
                        color: '#00DDFF',
                        width: 25,
                        align: 'right',
                        fontFamily: 'Furore'
                    },
                    label: {
                        fontSize: 14,
                        fontWeight: 'normal',
                        color: 'rgba(255,255,255,.5)',
                        width: 10,
                        align: 'center',
                        fontFamily: 'Furore'
                    },
                    rate: {
                        fontSize: 14,
                        padding: [0, 0, 0, 3],
                        align: 'right',
                        fontFamily: 'Furore',
                        color: 'rgba(255,255,255,1)'
                    }
                }
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: (params: {
                data: {
                    name: string
                    value: string
                    rate: string
                }
            }) => {
                const {
                    data: { name, value, rate }
                } = params
                return `${name}：${value}家(${rate})`
            }
        },
        graphic: [ // 设置饼图中间文字内容
            {
                type: 'text',
                left: '12%', // center不行 因为会飞到整个div的中间
                top: '40%',
                style: {
                    text: count,
                    textAlign: 'center',
                    fontWeight: 'normal',
                    fill: 'rgba(255,255,255,.85)',
                    fontSize: 24,
                    fontFamily: 'Oswald'
                }
            }
        ],
        series: [
            {
                name: '企业档案',
                type: 'pie',
                center: ['20%', '50%'],
                radius: ['70%', '100%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                data: pieData,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            }
        ]
    }
    return chartOption
}

/**
 * @name: 水环境质量-柱形图-闭环管理
 * @param {string} xData
 * @param {number} yData
 */
export const getChartCloseBarWaterQualityOption = (xData: string[], yData: { value: number; done: number; unDone: number }[]) => {
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter(params: any) {
                const str = `<div><div>${params[0].axisValue}</div>
                <div style='display: flex;height:20px;align-items:center;'>
                    <span>
                        总共${params[0].data}${params[0].seriesName}：
                    </span>
                </div>
                <div style='display: flex;height:20px;align-items:center;'>
                ${params[1].marker}             
                    <span>
                        已处置：${params[1].data}${params[0].seriesName}
                    </span>
                </div>
                <div style='display: flex;height:20px;align-items:center;'>
                ${params[0].marker}             
                    <span>
                        未处置：${params[0].data - params[1].data}${params[0].seriesName}
                    </span>
                </div>
                `
                return str
            }
        },
        color: ['#F84439', '#36F097'],
        grid: {
            top: '25',
            left: '0',
            bottom: '25',
            right: '10'
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#ffffff',
                    fontSize: 14,
                    interval: 0,
                    fontFamily: 'TRENDS'
                },
                axisLine: {
                    lineStyle: {
                        color: '#4E95FF'
                    }
                },
                data: xData
            }
        ],
        yAxis: [
            {
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['transparent', 'rgba(255, 255, 255, 0.05)'],
                    },
                },
                axisLabel: {
                    show: false
                }
            }
        ],
        series: [
            {
                name: '个',
                type: 'bar',
                barWidth: 25,
                data: yData.map(item => item.value),
                itemStyle: {
                    color: '#F84439',
                    normal: {

                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    color: 'white',
                    fontFamily: 'Furore',
                    fontSize: 14,
                    formatter: (val: any) => {
                        const index = val.dataIndex
                        const currData = yData[index]
                        return `${Math.round(currData.done / currData.value * 1000) / 10}%`
                    }
                },
                z: '-1', // 改变这根柱子的层级使这根柱子在下面

            },
            {
                name: '个',
                type: 'bar',
                barWidth: 25,
                data: yData.map(item => item.done),
                itemStyle: {
                    color: '#36F097'
                },
                barGap: '-100%', // 移动第二个柱子的位置实现重叠
            }
        ]
    }
    return option
}

/**
 * @name: 涝水预警-闭环管理
 * @param {string} pieData
 * @param {number} count
 */
export const getWaterloggingWarningCloseOption = (pieData: { name: string; value: number; rate: string }[]) => {
    const chartOption = {
        grid: {
            top: 0,
            left: 55,
            bottom: '1%',
        },
        color: ['#36F097', '#F84439', '#F7C706'],
        legend: {
            type: 'scroll',
            orient: 'vertical',
            itemGap: 10,
            left: '40%',
            top: '11%',
            itemWidth: 10,
            itemHeight: 10,
            icon: 'circle',
            data: pieData,
            formatter: (name: string) => {
                for (let i = 0; i < pieData.length; i++) {
                    if (name === pieData[i].name) {
                        const richText = `{name|${name}}{num${i + 1}|${pieData[i].value}}{label|${'/'}}{rate|${pieData[i].rate}}`
                        return richText
                    }
                }
            },
            textStyle: {
                rich: {
                    name: {
                        width: 85,
                        fontSize: 14,
                        color: '#FFFFFF',
                        fontFamily: 'TRENDS'
                    },
                    num1: {
                        fontSize: 16,
                        color: '#36F097',
                        width: 25,
                        align: 'right',
                        fontFamily: 'Furore'
                    },
                    num2: {
                        fontSize: 16,
                        color: '#F84439',
                        width: 25,
                        align: 'right',
                        fontFamily: 'Furore'
                    },
                    num3: {
                        fontSize: 16,
                        color: '#F7C706',
                        width: 25,
                        align: 'right',
                        fontFamily: 'Furore'
                    },
                    label: {
                        fontSize: 16,
                        fontWeight: 'normal',
                        color: 'rgba(255,255,255,.5)',
                        width: 10,
                        align: 'center',
                        fontFamily: 'Furore'
                    },
                    rate: {
                        fontSize: 16,
                        padding: [0, 0, 0, 3],
                        align: 'right',
                        fontFamily: 'Furore',
                        color: 'rgba(255,255,255,1)'
                    }
                }
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: (params: {
                data: {
                    name: string
                    value: string
                    rate: string
                }
            }) => {
                const {
                    data: { name, value, rate }
                } = params
                return `${name}：${value}家(${rate})`
            }
        },
        series: [
            {
                name: '企业档案',
                type: 'pie',
                center: ['20%', '50%'],
                radius: ['70%', '100%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                data: pieData,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            }
        ]
    }
    return chartOption
}

/**
 * @name: 供水预警-闭环管理
 * @param {string} xData
 * @param {number} yData
 */
export const getEarlyWarningWaterSupplyOption = (xData: string[], yData: { value: number; done: number; unDone: number }[]) => {
    const colorList = ['#36F097', '#F7C706', '#F84439']
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
        },
        color: colorList,
        grid: {
            top: '30',
            left: '10',
            bottom: '25',
            right: '10'
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: (val: string) => {
                        const index = xData.indexOf(val)
                        return colorList[index]
                    },
                    fontSize: 14,
                    interval: 0,
                    fontFamily: 'TRENDS'
                },

                axisLine: {
                    lineStyle: {
                        color: '#038b8f'
                    }
                },
                data: xData
            }
        ],
        yAxis: [
            {
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['transparent', 'rgba(255, 255, 255, 0.05)'],
                    },
                },
                axisLabel: {
                    show: false
                }
            }
        ],
        series: [
            {
                name: '个',
                type: 'bar',
                barWidth: 25,
                data: yData.map((item, index) => {
                    return {
                        value: item.value,
                        itemStyle: {
                            color: colorList[index],
                        },
                        label: {
                            color: colorList[index],
                        }
                    }
                }),
                label: {
                    show: true,
                    position: 'top',
                    fontFamily: 'Furore',
                    fontSize: 14,
                    formatter: (val: any) => {
                        const index = val.dataIndex
                        const currData = yData[index]
                        return `${Math.round(currData.done / currData.value * 1000) / 10}%`
                    }
                },
                z: '-1', // 改变这根柱子的层级使这根柱子在下面

            },
        ]
    }
    return option
}

/**
 * @name: 水球图-节水预警-闭环管理
 */
export const getBallWaterSaveWaterCloseOption = (rate: number) => {
    // 指定图表的配置项和数据
    const option = {
        // backgroundColor: '#050038',
        title: {
            text: '处置率',
            left: '24%',
            top: '23%',
            textStyle: {
                fontWeight: 'normal',
                fontSize: 14,
                fontFamily: 'TRENDS',
                color: 'rgba(255, 255, 255, 1)'
            }
        },
        series: [{
            type: 'liquidFill',
            radius: '92%',
            center: ['50%', '50%'],
            data: [0.5, 0.5, 0.5],
            borderWidth: 0,
            outline: {
                show: true,
                borderDistance: 4, // 边距和圆的间距
                itemStyle: {
                    color: 'none',
                    borderColor: 'rgba(2, 198, 252, .5)',
                    borderWidth: 2,
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.25)'
                }
            },
            backgroundStyle: {
                color: 'rgba(2,156,252,.2)' // 球背景颜色
            },
            itemStyle: {
                color: 'rgba(0, 175, 223, 1)' // 设置中间波澜颜色
            },
            label: {
                position: ['50%', '60%'],
                formatter: `${rate}%`,
                color: 'white',
                textStyle: {
                    fontFamily: 'Furore',
                    fontSize: 20
                }
            },
        }
        ]
    }
    return option
}

/**
 * @name: 排口监测
 * @param {string} xData
 * @param {number} yData
 */
export const getDischargeMonitoringOption = (xData: string[], yData: number[], factorData: {
    markLimit: number
    name: string
    unit: string
}) => {
    const { markLimit, name, unit } = factorData
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter(params: any) {
                const str = `<div><div>${params[0].seriesName}</div><div style='display: flex;height:20px;align-items:center;'>${params[0].marker}
                                <div>${params[0].axisValue}：${params[0].data + unit}</div></div>`
                return str
            }
        },
        title: {
            text: `${name} 过去24小时趋势变化`,
            left: 'center',
            textStyle: {

                color: 'white',
                fontFamily: 'TRENDS',
                fontSize: 12
            }
        },
        color: ['#00DDFF'],
        grid: {
            top: '50',
            left: '30',
            bottom: '35',
            right: '10'
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#ffffff',
                    fontSize: 12,
                    // interval: 0, // 强制显示所有x轴标签
                    fontFamily: 'TRENDS'
                },
                axisLine: {
                    lineStyle: {
                        color: '#038b8f'
                    }
                },
                data: xData
            }
        ],
        yAxis: [
            {
                name: unit,
                nameTextStyle: {
                    fontFamily: 'TRENDS',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '12px',
                    align: 'center'
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    // x轴竖线
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.15)'
                        // type: 'dashed',
                    },
                },
                axisLabel: {
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'TRENDS',
                    fontSize: 12,
                }
            }
        ],
        series: [
            {
                name,
                type: 'line',
                // smooth: true, // 折线平滑
                data: yData,
                symbolSize: 'none', // 设定拐点的大小
                lineStyle: {
                    // 设置折线颜色
                    color: '#00DDFF'
                },
                areaStyle: {
                    // 阴影颜色渐变
                    normal: {
                        color: {
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: 'rgba(0, 221, 255, 0.7)' // 100% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(0, 221, 255, 0)' // 0% 处的颜色
                                }
                            ],
                            globalCoord: false, // 缺省为 false
                        }
                    }
                },
                markLine: {
                    symbol: 'none', // 去掉箭头
                    data: [
                        {
                            yAxis: markLimit,
                            name: '标准值',
                            symbol: 'none',
                            label: {
                                show: true,
                                formatter: '{b}',
                                position: 'middle',
                                distance: -8,
                                fontSize: 12,
                                lineHeight: 15,
                                padding: [2, 6, 0, 6],
                                color: '#FFFFFF',
                                backgroundColor: '#F84439',
                                borderRadius: 8
                            },
                            lineStyle: {
                                type: 'solid',
                                color: '#F84439',
                                width: 2
                            }
                        },
                    ]
                }

            }
        ]
    }
    return option
}

/**
 * @name: 问题统计-水环境质量-闭环管理
 * @param {string} pieData
 * @param {number} count
 */
export const getProblemStatisticsCloseOption = (pieData: { name: string; value: number; rate: string; done: number }[]) => {
    const chartOption = {
        grid: {
            top: 0,
            left: 55,
            bottom: '1%',
        },
        color: ['#26BCFF', '#FF9110'],
        legend: {
            type: 'scroll',
            orient: 'vertical',
            itemGap: 16,
            left: '22%',
            top: '10%',
            itemWidth: 10,
            itemHeight: 10,
            icon: 'circle',
            data: pieData,
            formatter: (name: string) => {
                for (let i = 0; i < pieData.length; i++) {
                    if (name === pieData[i].name) {
                        const currData = pieData[i]
                        const richText = `{name|${name}}{num|${currData.done}}{total|/${currData.value}}{label|处置率 }{rate|${currData.rate}}`
                        return richText
                    }
                }
            },
            textStyle: {
                rich: {
                    name: {
                        width: 75,
                        fontSize: 14,
                        color: '#FFFFFF',
                        fontFamily: 'TRENDS'
                    },
                    num: {
                        fontSize: 14,
                        color: '#00DDFF',
                        width: 25,
                        align: 'right',
                        fontFamily: 'Furore'
                    },
                    label: {
                        fontSize: 14,
                        fontWeight: 'normal',
                        color: 'rgba(255,255,255,1)',
                        align: 'TRENDS',
                        fontFamily: 'Furore'
                    },
                    total: {
                        fontSize: 14,
                        align: 'right',
                        fontFamily: 'Furore',
                        width: 45,
                        color: 'rgba(255,255,255,1)'
                    },
                    rate: {
                        fontSize: 14,
                        align: 'right',
                        fontFamily: 'Furore',
                        color: 'rgba(255,255,255,1)'
                    }
                }
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: (params: {
                data: {
                    name: string
                    value: string
                    rate: string
                }
            }) => {
                const {
                    data: { name, value, rate }
                } = params
                return `${name}：${value}家(${rate})`
            }
        },
        series: [
            {
                name: '问题来源',
                type: 'pie',
                center: ['9%', '50%'],
                radius: ['60%', '90%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                data: pieData,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            }
        ]
    }
    return chartOption
}

/**
 * @name: 问题统计-水环境质量-闭环管理
 * @param {string} pieData
 * @param {number} count
 */
export const getKeyControlCloseOption = (pieData: { name: string; value: number; rate: string; done: number }[]) => {
    const chartOption = {
        grid: {
            top: 0,
            left: 55,
            bottom: '1%',
        },
        color: ['#F84439', '#F7C706', '#FF8000'],
        legend: {
            // type: 'scroll',
            // orient: 'vertical',
            itemGap: 16,
            left: '22%',
            top: '10%',
            itemWidth: 10,
            itemHeight: 10,
            icon: 'circle',
            data: pieData,
            formatter: (name: string) => {
                for (let i = 0; i < pieData.length; i++) {
                    if (name === pieData[i].name) {
                        const currData = pieData[i]
                        const richText = `{name|${name}}{rate|${currData.rate}}`
                        return `${richText}`
                    }
                }
            },
            textStyle: {
                rich: {
                    name: {
                        fontSize: 14,
                        color: '#FFFFFF',
                        fontFamily: 'TRENDS'
                    },
                    rate: {
                        fontSize: 14,
                        align: 'right',
                        fontFamily: 'Furore',
                        color: 'rgba(255,255,255,1)'
                    }
                }
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: (params: {
                data: {
                    name: string
                    value: string
                    rate: string
                }
            }) => {
                const {
                    data: { name, value, rate }
                } = params
                return `${name}：${value}mg(${rate})`
            }
        },
        series: [
            {
                name: '问题来源',
                type: 'pie',
                center: ['9%', '50%'],
                radius: ['60%', '90%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                data: pieData,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            }
        ]
    }
    return chartOption
}

/**
 * @name: 问题统计-水环境质量-闭环管理
 * @param {string} pieData
 * @param {number} count
 */
export const getProblemStatisticsSewagCloseOption = (pieData: { name: string; value: number }[], text: string) => {
    const chartOption = {
        title: {
            text,
            bottom: 0,
            left: 'center',
            textStyle: {
                fontFamily: 'TRENDS',
                fontSize: 14,
                color: 'white'
            }
        },
        grid: {
            top: 0,
            left: 55,
            bottom: '1%',
        },
        color: ['#36F097', '#F84439'],
        tooltip: {
            trigger: 'item',
            formatter: (params: {
                data: {
                    name: string
                    value: string
                    rate: string
                }
            }) => {
                const {
                    data: { name, value }
                } = params
                return `${text}：\n ${name}:${value}个`
            }
        },
        series: [
            {
                name: text,
                type: 'pie',
                center: ['50%', '32%'],
                radius: ['55%', '80%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                data: pieData,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            }
        ]
    }
    return chartOption
}

export const fiveRadarOption = () => {
    const option = {
        title: {
            text: 91.2,
            left: 'center',
            top: 'center',
            textStyle: {
                fontFamily: 'Furore',
                fontSize: 32,
                color: 'white'
            }
        },
        radar: {
            // center: ['50%', '55%'],
            // radius: 70,
            // name: {
            //     textStyle: {
            //         // padding: [-20, -52] // 控制文字padding
            //     }
            // },
            nameGap: 10,
            axisName: {
                formatter: '{value}',
                color: '#FFFFFF',
                fontFamily: 'TRENDS',
                fontSize: '16px'
            },
            splitArea: {
                areaStyle: {
                    color: ['rgba(242, 242, 242, 0.05)', 'rgba(250, 250, 250, 0.05)'],
                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                    shadowBlur: 10
                }
            },
            // axisLabel: {
            //     show: true,
            //     formatter: '{value}',
            //     color: 'white'
            // },
            axisLine: {
                lineStyle: {
                    color: 'rgba(211, 253, 250,  0)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['rgba(255, 255, 255, 0.05)']
                }
            },
            splitNumber: 4,
            indicator: [
                { name: '碧水指数', max: 100 },
                { name: '节水指数', max: 100 },
                { name: '供水指数', max: 100 },
                { name: '洪水指数', max: 100 },
                { name: '涝水指数', max: 100 },
            ]
        },
        // color: ['#00DDFF'],
        series: [
            {
                name: 'Budget vs spending',
                type: 'radar',
                emphasis: {
                    lineStyle: {
                        width: 4
                    }
                },
                data: [
                    {
                        label: {
                            show: true,
                            color: '#00DDFF', // 'inherit',
                            position: 'top',
                            fontFamily: 'Furore',
                            fontSize: 16
                        },
                        // symbol: 'none',
                        symbolSize: 0,
                        value: [89, 92, 93, 90, 92],
                        name: 'Allocated Budget',
                        areaStyle: {
                            color: 'rgba(0, 221, 255, 0.2)'
                        },
                        lineStyle: {
                            color: '#00DDFF'
                        },
                    },
                ]
            }
        ]
    }
    return option
}

export const fiveWAterResultsLineOption = () => {
    const areaName = '余杭区'
    const option = {
        tooltip: {
            link: { xAxisIndex: 'all' },
            trigger: 'axis',
            borderColor: 'rgba(1, 16, 24, 0.8)',
            backgroundColor: 'rgba(1, 16, 24, 0.8)',
            formatter: (params: any) => {
                if (!params.length) return ''
                let str = `<div><span style="font-size: 12px;color: white;font-family: Furore;">${params[0].axisValue}</span>  <span style="font-size: 12px;color: white;font-family: TRENDS;"> ${areaName}</span></div>`
                params.forEach((element: any) => {
                    str += `<div style="display: flex;align-items: center;">
                        ${element.marker}
                        <span style="font-size: 12px;font-family: TRENDS;color: white;">${element.seriesName}</span>
                        <div style="font-size: 12px;font-family: Furore;color: #34EAE3; text-align: right;width: 80px;">${element.value}</div>
                    </div>`
                })
                return `<div >${str}</div>`
            }
        },
        legend: {
            bottom: 10,
            left: 'center',
            itemWidth: 30,
            itemHeight: 7,
            // icon: 'circle',
            textStyle: {
                fontSize: 12,
                color: '#ffffff',
                fontFamily: 'TRENDS'
            }
        },
        grid: {
            top: 30,
            left: 60,
            right: 32,
            bottom: 70
        },
        xAxis: {
            axisLabel: {
                show: true,
                fontFamily: 'Furore',
                fontSize: 12,
                color: 'rgba(255,255,255,.6)'
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(255,255,255,0.2)',
                },
            },
            axisTick: { show: false },
            data: [
                '2022-01', '2022-02', '2022-03', '2022-04', '2022-05', '2022-06', '2022-07', '2022-08', '2022-09',
                '2022-10', '2022-11', '2022-12',
            ],
            gridIndex: 0,
            type: 'category',
        },
        yAxis: {
            axisLabel: {
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'Furore',
                fontSize: 12,
            },
            axisLine: {
                show: false,
                lineStyle: { color: 'rgba(255,255,255,0.5)' },
            },
            axisTick: { show: false },
            gridIndex: 0,
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.15)'
                }
            },
            type: 'value',
        },
        color: ['#0AAEFF', '#2AC94F', '#F84439', '#FFB443', '#FF0097', '#801DAE'],
        series: [
            {
                data: [
                    49, 24, 28, 37, 32, 24, 48, 42, 50, 26, 40, 30, 42, 26, 27, 37, 39, 39,
                    18, 33, 28, 30, 17, 25, 29, 20, 32, 36, 26, 20, 29, 22, 25, 20, 34, 50,
                ],
                name: '综合指数',
                type: 'line',
            },
            {
                data: [
                    18, 33, 28, 30, 17, 25, 29, 20, 32, 36, 26, 20, 29, 22, 25, 20, 34, 50,
                    49, 24, 28, 37, 32, 24, 48, 42, 50, 26, 40, 30, 42, 26, 27, 37, 39, 39,
                ],
                name: '碧水指数',
                type: 'line',
            },
            {
                data: [
                    63, 55, 52, 74, 74, 37, 70, 56, 31, 32, 32, 41, 96, 98, 59, 92, 29, 97,
                    18, 33, 28, 30, 17, 25, 29, 20, 32, 36, 26, 20, 29, 22, 25, 20, 34, 50,
                ],
                name: '涝水指数',
                type: 'line',
            },
            {
                data: [
                    44, 37, 25, 43, 46, 43, 56, 49, 45, 32, 37, 29, 48,
                    63, 55, 52, 74, 74, 37, 70, 56, 31, 32, 32, 41, 96, 98, 59, 92, 29, 97,
                ],
                name: '洪水指数',
                type: 'line',
            },
            {
                data: [
                    24, 44, 38, 39, 16, 32, 43, 39, 43, 50, 48, 36, 29, 45, 44, 43, 40, 30,
                    63, 55, 52, 74, 74, 37, 70, 56, 31, 32, 32, 41, 96, 98, 59, 92, 29, 97,
                ],
                name: '供水指数',
                // symbol: 'circle',
                // symbolSize: 6,
                type: 'line',
            },
            {
                data: [
                    63, 55, 52, 24, 74, 57, 70, 56, 31, 32, 32, 41, 96, 38, 59, 92, 29, 97,
                    24, 44, 38, 39, 16, 32, 43, 39, 43, 50, 48, 36, 29, 45, 44, 43, 40, 30,
                ],
                name: '节水指数',
                // symbol: 'circle',
                // symbolSize: 6,
                type: 'line',
            }
        ]
    }
    return option
}

export const fiveWAterResultsBarStackOption = () => {
    const xdata = ['仁和街道', '良渚街道', '闲林街道', '仓前街道', '余杭街道', '中泰街道', '五常街道', '径山镇', '瓶窑镇', '鸬鸟镇', '百丈镇', '黄湖镇']
    const series = [
        {
            barWidth: 15,
            data: [49, 24, 28, 37, 32, 24, 48, 42, 50, 26, 40, 30],
            name: '碧水指数',
            stack: '信访', // 关键是stack一致
            type: 'bar'
        },
        {
            barWidth: 15,
            data: [36, 26, 20, 29, 22, 25, 20, 34, 50, 26, 27, 37],
            name: '涝水指数',
            stack: '信访', // 关键时stack一致
            type: 'bar'
        },
        {
            barWidth: 15,
            data: [39, 18, 33, 28, 30, 17, 25, 29, 20, 32, 39, 42],
            name: '洪水指数',
            stack: '信访', // 关键时stack一致
            type: 'bar'
        },
        {
            barWidth: 15,
            data: [24, 44, 38, 39, 16, 32, 43, 39, 43, 50, 48, 36, 29],
            name: '供水指数',
            stack: '信访', // 关键时stack一致
            type: 'bar'
        },
        {
            barWidth: 15,
            data: [63, 55, 52, 74, 74, 37, 70, 56, 31, 32, 32, 41, 96, 98],
            name: '节水指数',
            stack: '信访', // 关键时stack一致
            type: 'bar'
        }
    ]
    const option = {
        tooltip: {
        // 过滤掉统计的series
            trigger: 'axis',
            axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            borderColor: 'rgba(1, 16, 24, 0.8)',
            backgroundColor: 'rgba(1, 16, 24, 0.8)',
            formatter(params: any) {
                const resultArr = params.reverse()
                let str = `<div><div style="color: white;font-size: 12px;font-family: TRENDS;">${params[0].axisValue}</div>`
                resultArr.forEach((item: any) => {
                    str += `<div style="display:flex;height:20px;align-items:center;">
                        ${item.marker}
                        <div style="width: 120px;color: white;font-size: 12px;font-family: TRENDS;">${item.seriesName}</div>
                        <div style='font-family:Furore;color: #34EAE3;font-size: 12px;'>${item.value}</div>
                    </div></div>`
                })
                return str
            }
        },
        color: ['#2AC94F', '#FFB443', '#F84439', '#0AAEFF', '#A162F7'],
        grid: {
            top: 30,
            left: '60',
            bottom: 60,
            right: '20'
        },
        legend: {
            bottom: 10,
            left: 'center',
            itemWidth: 10,
            itemHeight: 10,
            // icon: 'circle',
            textStyle: {
                fontSize: 12,
                color: '#ffffff',
                fontFamily: 'TRENDS'
            }
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    fontFamily: 'TRENDS',
                    fontSize: 12,
                    color: 'rgba(255, 255, 255, 0.6)'
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.2)',
                    },
                },
                data: xdata
            }
        ],
        yAxis: [
            {
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'Furore',
                    fontSize: 12,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.15)'
                    }
                },
            }
        ],
        series
    }
    return option
}
