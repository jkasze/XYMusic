import xyRequest from './index'

export function getBanners() {
    return xyRequest.get("/banner", {
        type: 2
    })
}


export function getRankings(idx) {
    return xyRequest.get("/top/list", {
        idx
    })
}