import xyRequest from "./index"

export function getSearchHot() {
  return xyRequest.get("/search/hot")
}

export function getSearchSuggest(keywords) {
  return xyRequest.get("/search/suggest", {
    keywords,
    type: "mobile"
  })
}

export function getSearchResult(keywords) {
  return xyRequest.get("/search", {
    keywords
  })
}
