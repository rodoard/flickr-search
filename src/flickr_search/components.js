export default function(document) {
  return {
    go: go(document), 
    thumbs: thumbs(document),
    search: search(document),
    error: error(document),
    get: (name) => element(document, name)
  }
}

const element = (document, name) => document.getElementById(name)
const error = (document) => element(document, "error")
const go = (document) => element(document, "go")
const thumbs = (document) => element(document, "thumbs")
const search = (document) => element(document,"search")
