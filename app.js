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
        if (!r.results.length) return result.insertAdjacentHTML('afterbegin', '<div>Aucun établissements de formations trouvés</div>')

        r.results.map( function (data) {
          return result.insertAdjacentHTML('beforeend',
            '<div class="formations">' +
              '<div>Raison Sociale : <b> ' + displayValue(data.da_raison_sociale) + '</b></div>' +
              '<div>Nombre de formateurs : <b>' + displayValue(data.form_total) + '</b></div>' +
              '<div>Numéro d\'établissement de la structure : <b>' + displayValue(data.da_no_etab) + '</b></div>' +
              '<div>Numéro de SIREN de la structure : <b>' + displayValue(data.da_siren) + '</b></div>' +
              '<div>Numéro de la Déclaration d\'Activité : <b>' + displayValue(data.numero_de_da) + '</b></div>' +
              '<div>' +
                '<div class="adr-type">Adresse postale</div>' +
                '<div>Ville de l\'adresse postale : <b>' + displayValue(data.adr_ville_postale) + '</b></div>' +
                '<div>Code postal de l\'adresse postale : <b>' + displayValue(data.adr_code_postal_postale) + '</b></div>' +
                '<div>Voie de l\'adresse postale : <b>' + displayValue(data.adr_rue_postale) + '</b></div>' +
                '<div>Complément de l\'adresse postale : <b>' + displayValue(data.adr_rue_complement_postale) + '</b></div>' +
              '</div>' +
              '<div>' +
                '<div class="adr-type">Adresse physique</div>' +
                '<div>Ville de l\'adresse physique : <b>' + displayValue(data.adr_ville_physique) + '</b></div>' +
                '<div>Code postal de l\'adresse physique : <b>' + displayValue(data.adr_code_postal_physique) + '</b></div>' +
                '<div>Voie de l\'adresse physique : <b>' + displayValue(data.adr_rue_physique) + '</b></div>' +
                '<div>Complément de l\'adresse physique : <b>' + displayValue(data.adr_rue_complement_physique) + '</b></div>' +
              '</div>' +
            '</div>')
        })

        result.insertAdjacentHTML('afterbegin', '<div><b>' + r.total + '</b> établissements de formations trouvés</div>')
        $('.formations').transition('vertical flip in')
      }
    )
  })
