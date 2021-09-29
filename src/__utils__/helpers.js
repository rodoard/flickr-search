export const template = (search='')=> `<div>
      <input value="${search}" type='text' name='search' id="search">
      <button id="go" class='go'>Go</button>
    </div> 
    <div id="error"></div>
    <div id="thumbs" class='thumbs'>
    </div>`
