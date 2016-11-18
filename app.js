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

const url = '/organizations/'
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
        if (!r.results.length) return result.insertAdjacentHTML('afterbegin', '<div>Aucun établissement de formation trouvé</div>')

        r.results.map( function (organization) {
          return result.insertAdjacentHTML('beforeend',
            '<div class="formations">' +
              '<div>Raison Sociale : <b> ' + displayValue(organization.da_raison_sociale) + '</b></div>' +
              '<div>Nombre de formateurs : <b>' + displayValue(organization.form_total) + '</b></div>' +
              '<div>Numéro d\'établissement de la structure : <b>' + displayValue(organization.da_no_etab) + '</b></div>' +
              '<div>Numéro de SIREN de la structure : <b>' + displayValue(organization.da_siren) + '</b></div>' +
              '<div>Numéro de la Déclaration d\'Activité : <b>' + displayValue(organization.numero_de_da) + '</b></div>' +
              '<div>' +
                '<div class="adr-type">Adresse postale</div>' +
                '<div>Ville de l\'adresse postale : <b>' + displayValue(organization.adr_ville_postale) + '</b></div>' +
                '<div>Code postal de l\'adresse postale : <b>' + displayValue(organization.adr_code_postal_postale) + '</b></div>' +
                '<div>Voie de l\'adresse postale : <b>' + displayValue(organization.adr_rue_postale) + '</b></div>' +
                '<div>Complément de l\'adresse postale : <b>' + displayValue(organization.adr_rue_complement_postale) + '</b></div>' +
              '</div>' +
              '<div>' +
                '<div class="adr-type">Adresse physique</div>' +
                '<div>Ville de l\'adresse physique : <b>' + displayValue(organization.adr_ville_physique) + '</b></div>' +
                '<div>Code postal de l\'adresse physique : <b>' + displayValue(organization.adr_code_postal_physique) + '</b></div>' +
                '<div>Voie de l\'adresse physique : <b>' + displayValue(organization.adr_rue_physique) + '</b></div>' +
                '<div>Complément de l\'adresse physique : <b>' + displayValue(organization.adr_rue_complement_physique) + '</b></div>' +
              '</div>' +
            '</div>')
        })

        result.insertAdjacentHTML('afterbegin', '<div><b>' + r.total + '</b> établissements de formations trouvés</div>')
        $('.formations').transition('vertical flip in')
      }
    )
  })
