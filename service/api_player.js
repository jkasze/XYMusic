import xyRequest from './index'

export function getSongDetail(ids) {
  return xyRequest.get('/song/detail', {
    ids
  })
}
