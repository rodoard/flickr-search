export default class FlickrApi {
   constructor({key, url}) {
    this.key = key 
    this.url = url
   }
   get(search, options={}){
     return fetch(toFlickrSearchUrl({
      key:this.key,
      url:this.url,
      search,
      ...options
     })).then(response=> response.json())
   }
}

export const toFlickrSearchUrl = ({url, key, search, page=1, per_page=20}) => 
`${url}?method=flickr.photos.search&api_key=${key}&tags=${encodeURIComponent(search)}&format=json&media=photos&nojsoncallback=1&extras=views`
