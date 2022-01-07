import xyRequest from './index'

export function getTopMV(offset, limit = 10) {
    return xyRequest.get("/top/mv", {
        offset,
        limit
    })
}

/**
 * 请求MV的播放地址
 * @param {number} id 
 */
export function getMVURL(id) {
    return xyRequest.get("/mv/url", {
        id
    })
}

/**
 * 请求MV的详情
 * @param {number} mvid 
 */
export function getMVDetail(mvid) {
    return xyRequest.get("/mv/detail", {
        mvid
    })
}

/**
 * 请求MV的相关信息
 * @param {number} id 
 */
export function getRelatedVideo(id) {
    return xyRequest.get("/related/allvideo", {
        id
    })
}