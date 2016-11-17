function getData(url) {
  return fetch(url)
    .then(response => response.json())
    .catch((err) => {
      console.error(err)
      throw err
  })
}

const url = 'https://inspire.data.gouv.fr/api/geogw/records'
const form = document.getElementById('form')
const result = document.getElementById('result')

form.addEventListener('submit', (event) => {
    event.preventDefault()
    result.innerHTML = '<div class="ui active centered inline massive loader"></div>'
    const q = document.getElementById('textinput').value
    const promise = getData(url + `?q=${q}`)
    promise
      .then( r => {
        result.innerHTML = null
        if (!r.results.length) return result.insertAdjacentHTML('afterbegin', '<div>Aucune formation trouvée</div>')

        r.results.map( data =>
          result.insertAdjacentHTML('beforeend', `
            <div class="formations">
              <h3>${data.metadata.title}</h3>
              <div>${data.metadata.description}</div>
              <div><div class="formations-id">${data.recordId}</div></div>
            </div>`)
          )

        result.insertAdjacentHTML('afterbegin', `<div><b>${r.count}</b> formations trouvées</div>`)
        $('.formations').transition('vertical flip in')
      }
    )
  })
