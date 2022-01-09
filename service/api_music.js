import xyRequest from './index'

export function getBanners() {
    return xyRequest.get("/banner", {
        type: 2
    })
}