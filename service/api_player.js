import xyRequest from './index'

export function getSongDetail(ids) {
  return xyRequest.get('/song/detail', {
    ids
  })
}

export function getSongLyric(id) {
  return xyRequest.get('/lyric',{
    id
  })
}
