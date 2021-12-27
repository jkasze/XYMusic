import xyRequest from './index'

export function getTopMV(offset, limit = 10) {
    return xyRequest.get("/top/mv", {
        offset,
        limit
    })

}