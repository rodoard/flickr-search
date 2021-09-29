import FlickrSearch, {generateThumbGrid, REQUEST_ERROR_MESSAGE, FLICKR_API_ERROR_MESSAGE} from './flickr_search'
import FlickrApi from './flickr_api'
import {flickrResult3, flickrErrorResult } from './__utils__/data'
import SearchComponents from './flickr_search/components'
import {
  template
} from './__utils__/helpers'
jest.mock('./flickr_api');
jest.mock('./flickr_search/components', () => {
  return jest.fn().mockImplementation(() => {
    return {
      input: jest.fn(),
      go: jest.fn(),
      thumbs: jest.fn()
    };
  })
})
const SEARCH_VALUE="saturn"
const UnMockedSearchComponents = jest.requireActual('./flickr_search/components');
const UnMockedFlickerApi = jest.requireActual('./flickr_api');

describe('FlickrSearch', () => {
  it('constructor takes api as argument', () => {
    const api = new FlickrApi()
    const search = new FlickrSearch(api)
    expect(search.api).toBe(api)
  });
  it("has init method", () => {
    const search = new FlickrSearch()
    expect(typeof search.init).toBe("function")
  })
  describe("init", () => {
    it("takes search components as arguments", () => {
      const search = new FlickrSearch()
      const components = SearchComponents()
      search.init(components)
      expect(search.search).toBe(components.search)
      expect(search.go).toBe(components.go)
      expect(search.thumbs).toBe(components.thumbs)
    })
    it("binds click event to 'go' element", () => {
      const search = new FlickrSearch()
      const components = SearchComponents()
      const go = {
        addEventListener: jest.fn()
      }
      components.go = go
      search.init(components)
      expect(go.addEventListener).toHaveBeenCalledWith("click", expect.anything())
    })
  })
  describe("go click event", () => {
    it("calls on api with search value", () => {
      document.body.innerHTML = template(SEARCH_VALUE)
      const api = {
        get: jest.fn()
      }
      const search = new FlickrSearch(api)
      const components = UnMockedSearchComponents.default(document)
      search.init(components)
      components.go.click()
      expect(api.get).toHaveBeenCalledWith(SEARCH_VALUE, {"page":1})
    })
     it("does not call on api with empty search", () => {
      document.body.innerHTML = template()
      const api = {
        get: jest.fn()
      }
      const search = new FlickrSearch(api)
      const components = UnMockedSearchComponents.default(document)
      search.init(components)
      components.go.click()
      expect(api.get).not.toHaveBeenCalled()
    })
    it("populates thumbs with results", async () => {
      document.body.innerHTML = template(SEARCH_VALUE)
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(flickrResult3)
        })
      ) 
      const search = new FlickrSearch(new 
        UnMockedFlickerApi.default({
        key: "key", url:"url"
      }))
      const components = UnMockedSearchComponents.default(document)
      let goCallback
      components.go = {
        addEventListener:(type, callback) =>{
          goCallback = callback
        },
        click:() => Promise.resolve(goCallback())
        
      }
      search.init(components)
      await search.go.click()
      const thumbs = document.getElementsByClassName('grid-item')
      expect(thumbs.length).toBe(4)
    })
     describe("errors", ()=>{
      it("displays request error on fetch error", async ()=>{
        document.body.innerHTML = template(SEARCH_VALUE)
        global.fetch = jest.fn(
          () => Promise.reject("request error")
        );
        const search = new FlickrSearch(new 
            UnMockedFlickerApi.default({
             key: "key", url:"url"
        }))
       const components = UnMockedSearchComponents.default(document)
        let goCallback
      components.go = {
        addEventListener:(type, callback) =>{
          goCallback = callback
        },
        click:() => Promise.resolve(goCallback())
        
      }
       search.init(components)
       await search.go.click()
       expect(search.error.innerHTML).toEqual(REQUEST_ERROR_MESSAGE)
      })
      it("displays api error on flickr api stat fail ", async ()=>{
         document.body.innerHTML = template(SEARCH_VALUE)
         global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(flickrErrorResult)
        })
      ) 
       const search = new FlickrSearch(new 
            UnMockedFlickerApi.default({
             key: "key", url:"url"
        }))
       const components = UnMockedSearchComponents.default(document)
       let goCallback
      components.go = {
        addEventListener:(type, callback) =>{
          goCallback = callback
        },
        click:() => Promise.resolve(goCallback())
        
      }
       search.init(components)
       await search.go.click()
       expect(search.error.innerHTML).toEqual(FLICKR_API_ERROR_MESSAGE)
      })
    })
  })
})
