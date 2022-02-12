import xyRequest from "./index"
export function getSearchHot() {
  return xyRequest.get("/search/hot")
}