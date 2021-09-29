export const FLICKR_API_ERROR_MESSAGE = "Flickr api error, please try again later."
export const REQUEST_ERROR_MESSAGE = "Request error, please try again later in case of network failure."
export const EMPTY_SEARCH_MESSAGE = "Empty search, ignoring..."

export default class FlickrSearch {
  constructor(api) {
    this.api = api
  }
  init(components) {
    this.components = components 
    const {
    search,
    go,
    thumbs,
    error
    } = components
    this.search = search
    this.go = go
    this.thumbs = thumbs
    this.error = error
    bindEvents.call(this)
  }
}

const bindEvents = function() {
  if (typeof this.go.addEventListener === "function")
    this.go.addEventListener("click", (event) => handleGo.call(this))
}

const handleError = function(message){
 this.error.innerHTML = message
}

function hideLoadMore(){
  this.__more.style.visibility = 'hidden' 
}

function showLoadMore(){
  this.__more.style.visibility = 'visible'
}

const loadMore = ({self, onStart, onFinished})=> {
   if (self.__page === -1) return Promise.resolve()
   const nextPage = self.__page +=1
   onStart()
   return Promise.resolve(getPage.call(self, nextPage))
    .then((data) => {
      if (data !== undefined) {
        if (data.stat === "ok") {
          addMore.call(self, data.photos.photo)
          const {page, pages} = data.photos
          if (page < pages) {
            self.__page = page
            showLoadMore.call(self)
          } else {
            hideLoadMore.call(self)
          }
        } else if (data.stat === "fail") {
          handleError.call(self, FLICKR_API_ERROR_MESSAGE)
        }
      }
    }).catch((e)=>{
      handleError.call(self, REQUEST_ERROR_MESSAGE)
    }).finally(
    onFinished()
  )
}

function getPage(page){
  return this.api.get(this.search.value, {page})
}

function handleGo() {
  const self = this
  const searchStr = self.search.value
  let resolve = () => {}
  if (searchStr && searchStr.length > 0) {
    resolve = (page) => getPage.call(this, page)
    initThumbGrid.call(self)
    self.__page = 0
  } else {
    handleError.call(self, EMPTY_SEARCH_MESSAGE) 
    self.__page = -1
  }
  return loadMore({
   self,
   onStart: () => disableElement(self.go),
   onFinished: () => enableElement(self.go)
  })
}

const thumbUrl = ({farm, server, secret, id}) => 
  `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_s.jpg`


function addMore(photos){
  const more =`${getThumbsHTML(photos)}${this.__more.outerHTML}`
  this.__more.remove()
  const grid = this.components.get('grid')
  const thumbs = grid.innerHTML
  grid.innerHTML = `${thumbs}${more}`
  initMore.call(this)
}

const getThumbsHTML = (photos)=> {
   let thumbs = ""
  photos.forEach(photo =>
    thumbs += `
      <div class="grid-item">
        <div class="image">
        <img src="${thumbUrl(photo)}">
        <div class="centered shadowed-text">${photo.views}</div> 
        </div>
      </div>
      `
  )
  return thumbs
}

const enableElement = element => element.disabled = false
const disableElement = element => element.disabled = true 

function enableLoadMore() {
  const more = this.__more
  const loadMoreBtn = this.__loadMore
  more.addEventListener('click', () =>{
    loadMore({
      self: this,
      onStart: () => disableElement(loadMoreBtn),
      onFinished: () => enableElement(loadMoreBtn) 
    })
  })

}

function initMore(){
 this.__more = this.components.get('more')
 this.__loadMore = this.components.get('load-more')
 enableLoadMore.call(this)
}

function initThumbGrid() {
  const more =  `<div id="more" class="grid-item" style="visibility:hidden">
      <button id="load-more">Load more</button>
  </div>`
  this.thumbs.innerHTML = `<div id="grid" class="grid-container">${more}</div>`
  initMore.call(this)
}
