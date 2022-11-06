export function getParametricEquation(startRatio: number, endRatio: number, isSelected: boolean, isHovered: boolean, k: number, height: number) {
    // 计算
    const midRatio = (startRatio + endRatio) / 2
    const startRadian = startRatio * Math.PI * 2
    const endRadian = endRatio * Math.PI * 2
    const midRadian = midRatio * Math.PI * 2

    if (startRatio === 0 && endRatio === 1)
        isSelected = false

    // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
    k = typeof k !== 'undefined' ? k : 1 / 3

    // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
    const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0
    const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0

    // 计算高亮效果的放大比例（未高亮，则比例为 1）
    const hoverRate = isHovered ? 1.05 : 1

    // 返回曲面参数方程
    return {

        u: {
            min: -Math.PI,
            max: Math.PI * 3,
            step: Math.PI / 32
        },

        v: {
            min: 0,
            max: Math.PI * 2,
            step: Math.PI / 20
        },

        x(u: number, v: number) {
            if (u < startRadian)
                return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate

            if (u > endRadian)
                return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate

            return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate
        },

        y(u: number, v: number) {
            if (u < startRadian)
                return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate

            if (u > endRadian)
                return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate

            return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate
        },

        z(u: number, v: number) {
            if (u < -Math.PI * 0.5)
                return Math.sin(u)

            if (u > Math.PI * 2.5)
                return Math.sin(u)

            return Math.sin(v) > 0 ? 1 * height : -1
        }
    }
}
interface pieOptionTs {
    k: number // 内外圆半径比例
    title: null | record
    legend: null | record
    left: strNum
    top: strNum
    distance: strNum // 远近
    tooltip: record
}
/**
 * @name: 3D饼图的配置项，同echarjs的series
 * @param {*} pieData 值配置
 * @param {*} internalDiameterRatio 内径占比
 * @return {*}
 */
export function getPie3D(pieData: { name: string; value: number; itemStyle?: record }[], optionStatic: Partial<pieOptionTs> = {}) {
    const series = []
    let sumValue = 0
    let startValue = 0
    let endValue = 0
    const legendData = []
    // 计算饼图内外圈的半径比例
    const k = 'k' in optionStatic
        ? optionStatic.k || 1 / 3
        : 1 / 3
    const max = Math.max(...pieData.map(item => item.value))
    // 3个饼图参数
    for (let i = 0; i < pieData.length; i++) {
        sumValue += pieData[i].value
        const seriesItem: any = {
            name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
            type: 'surface',
            parametric: true,
            wireframe: {
                show: false
            },
            label: {
                normal: {
                    position: 'inner',
                    show: false
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    },
                    smooth: 0.2,
                    length: 50,
                    length2: 100,
                }
            },
            pieData: pieData[i],
            pieStatus: {
                selected: false,
                hovered: false,
                k
            },
        }
        if (typeof pieData[i].itemStyle != 'undefined') {
            const itemStyle: record = {}
            typeof pieData[i].itemStyle?.color != 'undefined' ? itemStyle.color = pieData[i].itemStyle?.color : null
            typeof pieData[i].itemStyle?.opacity != 'undefined' ? itemStyle.opacity = pieData[i].itemStyle?.opacity : null
            seriesItem.itemStyle = itemStyle
        }
        series.push(seriesItem)
    }

    // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
    // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
    for (let i = 0; i < series.length; i++) {
        endValue = startValue + series[i].pieData.value
        series[i].pieData.startRatio = startValue / sumValue
        series[i].pieData.endRatio = endValue / sumValue
        series[i].parametricEquation = getParametricEquation(series[i].pieData.startRatio, series[i].pieData.endRatio,
            false, false, k, series[i].pieData.value)
        startValue = endValue
        legendData.push(series[i].name)
    }
    // 准备待返回的配置项，把准备好的 legendData、series 传入。
    const option: any = {
        title: optionStatic.title,
        tooltip: 'tooltip' in optionStatic
            ? optionStatic.tooltip
            : {
                formatter: (params: any) => {
                    if (params.seriesName !== 'mouseoutSeries')
                        return `${params.seriesName}<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>${option.series[params.seriesIndex].pieData.value}`
                }
            },
        legend: 'legend' in optionStatic
            ? optionStatic.legend
            : {
            // data: legendData,
                itemWidth: 10, // 色标图宽
                itemHeight: 10, // 色标图高
                orient: 'vertical', // 垂直显示
                top: 20,
                icon: 'circle',
                right: 0,
                itemGap: 15, // 色标间隔
                formatter: (name: string) => {
                    for (let i = 0; i < pieData.length; i++) {
                        if (name === pieData[i].name) {
                            const richText = `{name|${name}}{num|${pieData[i].value}}{rateUnit|万m³}`
                            return richText
                        }
                    }
                },
                textStyle: {
                    rich: {
                        name: {
                            width: 80,
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
                        rateUnit: {
                            fontSize: 14,
                            padding: [0, 0, 0, 3],
                            align: 'left',
                            fontFamily: 'TRENDS',
                            color: 'rgba(255,255,255,1)'
                        }
                    }
                }
            },
        xAxis3D: {
            min: -1,
            max: 1
        },
        yAxis3D: {
            min: -1,
            max: 1.2
        },
        zAxis3D: {
            min: -1,
            max: max * 0.8
        },
        grid3D: {
            show: false,
            boxHeight: 20,
            top: optionStatic.top || '10',
            left: optionStatic.left || '-100',
            environment: 'auto',
            viewControl: {
                distance: optionStatic.distance || 270, // 远近
                alpha: 25, // 饼图X轴旋转
                beta: 0, // 饼图Y轴旋转
            },

        },
        series
    }
    console.log(option, 'option')
    return option
}
