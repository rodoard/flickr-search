import FlickrApi from './flickr_api'
import FlickrSearch from './flickr_search'
import Components from './flickr_search/components'

const InitFlickrSearch = ({key, apiUrl}) => {
  const search = new FlickrSearch(
    new FlickrApi({
      key,
      url: apiUrl
    })
  )
  search.init(Components(document))
}

window.InitFlickrSearch = InitFlickrSearch
