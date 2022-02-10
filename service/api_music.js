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

export function getSongMenu(cat="全部", limit=6, offset=0) {
  return xyRequest.get("/top/playlist", {
    cat,
    limit,
    offset
  })
}