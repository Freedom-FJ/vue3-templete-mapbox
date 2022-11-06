/*
 * @Author: mjh
 * @Date: 2022-09-08 17:28:07
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-08 17:48:27
 * @Description:
 */
import { getAssetsFile } from '@/utils/tools'

/**
 * 添加区县marker
 */
export const addCountryMarker = (map: any, dataJson: Record<string, any>) => {
    dataJson.features.forEach((feature: Record<string, any>) => {
        const el = document.createElement('div')
        el.className = 'country-marker-content'
        el.innerHTML = `
        <div class='country-marker'>
            <div class="country-marker-left-big" style="background-color: ${feature.properties.Color}"></div>
            <div class='country-left-inner-big'>16%</div>
            <div class="country-marker-right" style="min-width: 110px;"></div>
            <div class='country-right-inner' style="display:flex;align-items: center;">
                ${feature.properties.Name}
                <div class='right-arrow-map'></div>
            </div>
        </div>
        <img style='margin-top: 2px;' src="${getAssetsFile('map/point_.svg')}" />`
        const coor = turf.centroid(feature).geometry.coordinates
        if (!window.countryMarker) window.countryMarker = {}
        let marker = window.countryMarker[feature.properties.Code]
        if (marker) {
            marker.remove()
            marker = null
        }
        window.countryMarker[feature.properties.Code] = new mapboxgl.Marker(el)
            .setLngLat([coor[0], coor[1] + 0.02])
            .addTo(map)
        // el.addEventListener('click', (e) => {
        //     e.stopPropagation()
        //     showMapPop('MapPointWarningPop', feature.properties, coor)
        // })
    })
}
