import Components from './components'
import {template} from '../__utils__/helpers'
describe('Components', () => {
    it("returns object with elements from document", ()=>{
      document.body.innerHTML = template()
      const components = Components(document)
      const actualKeys = Object.keys(components).sort()
      const expectedKeys = ["search", "go", "thumbs", "error", "get"].sort()
      expect(actualKeys).toEqual(expectedKeys)

      expectedKeys.forEach((element) => {
        if (element === "get") return
        let actual = components[element]
        let expected = document.getElementById(element)
        expect(actual).toEqual(expected)
      })
    })
});
