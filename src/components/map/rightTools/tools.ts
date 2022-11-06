/**
 * 地图放大
 */
export const zoom2Big = () => {
    // 暂定 最大18 最小7
    if (window.glMap.getZoom() < 18) window.glMap.zoomTo(window.glMap.getZoom() + 1)
}
/**
 * 地图缩小
 */
export const zoom2Small = () => {
    if (window.glMap.getZoom() > 7) window.glMap.zoomTo(window.glMap.getZoom() - 1)
}
/**
 * 地图复位
 */
export const initHomeView = () => {
    window.glMap.flyTo({
        center: [119.91405, 30.41918],
        zoom: 10.2,
        bearing: 0,
        pitch: 0,
    })
}
/**
 * 地图2d、3d切换
 */
let map23D = '2'
export const switch23D = () => {
    if (map23D === '2') {
        window.glMap.flyTo({ pitch: 45, zoom: window.glMap.getZoom(), speed: 0.2, curve: 1 })
        map23D = '3'
    }
    else if (map23D === '3') {
        window.glMap.flyTo({ pitch: 0, zoom: window.glMap.getZoom(), speed: 0.2, curve: 1 })
        map23D = '2'
    }
}
