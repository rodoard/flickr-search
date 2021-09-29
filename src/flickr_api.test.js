import FlickrApi, {
  toFlickrSearchUrl
} from './flickr_api'
import {
  flickrResult3
} from './__utils__/data'

const SATURN="SATURN"
describe('FlickrApi', () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    })
  );

  beforeEach(() => {
    fetch.mockClear();
  });
  const apiArguments = {
    key: '4e258a4396bf5ba0448b2e2fe574034e',
    url: 'https://api.flickr.com/services/rest/'
  }
  describe("toFlickrSearchUrl", ()=>{
     it("properly creates url", ()=>{
        const actual = toFlickrSearchUrl({
        url: apiArguments.url,
        key: apiArguments.key,
        search: "spacex,covid19"
      })
      const expectedUrl =
     "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=4e258a4396bf5ba0448b2e2fe574034e&tags=spacex%2Ccovid19&format=json&media=photos&nojsoncallback=1&extras=views"
     
     expect(actual).toBe(expectedUrl)
   })
  })

  it('constructor takes keyword argument {key, url}', () => {
    const api = new FlickrApi(apiArguments)
    expect(api.key).toBe(apiArguments.key)
    expect(api.url).toBe(apiArguments.url)
  });
  it("has get method", () => {
    const api = new FlickrApi(apiArguments)
    expect(typeof api.get).toBe("function")
  })
  describe("get", () => {
    it("calls fetch with passed search keyword", () => {
      const api = new FlickrApi(apiArguments)
       global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(flickrResult3)
        })
      )
      api.get(SATURN)
      const expectedFetchUrl = toFlickrSearchUrl({
        url: api.url,
        key: api.key,
        search: SATURN
      })
      expect(global.fetch).toHaveBeenCalledWith(expectedFetchUrl)
    })
    it("returns json", async() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(flickrResult3)
        })
      )
      const api = new FlickrApi(apiArguments)
      const result = await api.get(SATURN)
      expect(result).toEqual(flickrResult3)
    })
  })
});
