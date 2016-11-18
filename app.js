function getData(url) {
  return fetch(url)
    .then(function (response) { return response.json() })
    .catch(function (err) {
      console.error(err)
      throw err
  })
}

function displayValue(data) {
  return data || 'Non communiqué'
}

const url = 'http://127.0.0.1:8888/organizations/'
const form = document.getElementById('form')
const result = document.getElementById('result')

form.addEventListener('submit', function (event) {
    event.preventDefault()
    result.innerHTML = '<div class="ui active centered inline massive loader"></div>'
    const q = document.getElementById('textinput').value
    const promise = getData(url + '?q=' + q)
    promise
      .then( function (r) {
        result.innerHTML = null
        if (!r.results.length) return result.insertAdjacentHTML('afterbegin', '<div>Aucune formation trouvée</div>')

        r.results.map( function (data) {
          return result.insertAdjacentHTML('beforeend',
            '<div class="formations">' +
              '<div>Raison Sociale: <b> ' + displayValue(data.da_raison_sociale) + '</b></div>' +
              '<div>Numéro d\'établissement de la structure: <b>' + displayValue(data.da_no_etab) + '</b></div>' +
              '<div>Numéro de SIREN de la structure: <b>' + displayValue(data.da_siren) + '</b></div>' +
              '<div>Nombre de formateurs: <b>' + displayValue(data.form_total) + '</b></div>' +
              '<div>Numéro de la Déclaration d\'Activité: <b>' + displayValue(data.numero_de_da) + '</b></div>' +
            '</div>')
        })

        result.insertAdjacentHTML('afterbegin', '<div><b>' + r.total + '</b> formations trouvées</div>')
        $('.formations').transition('vertical flip in')
      }
    )
  })
