function getData(url) {
  return fetch(url)
    .then(function (response) { return response.json() })
    .catch(function (err) {
      console.error(err)
      throw err
    })
}

function displayValue(data, q) {
  return highlight(data, q) || 'Non communiqué'
}

function formatAdress(data, type) {
  const parts = ['<h3>Adresse ' + type + '</h3>'];
  if (data['adr_rue_complement_' + type]) {
    parts.push('<div>' + data['adr_rue_complement_' + type] + '</div>')
  }
  if (data['adr_rue_' + type]) {
    parts.push('<div>' + data['adr_rue_' + type] + '</div>')
  }
  parts.push('<div>')
  if (data['adr_code_postal_' + type]) {
    parts.push(data['adr_code_postal_' + type] + '&nbsp;')
  }
  parts.push(data['adr_ville_' + type] + '</div>')
  return parts.join('')
}

function highlight(text, q) {
    if (!text) return
    return q ? text.replace(RegExp('(' + q + ')', 'iu'), '<mark>$1</mark>') : text
}

function formatResult(organization, q) {
  return '<article class="item formation">' +
            '<div class="content">' +
              '<h2 class="header">' + highlight(organization.da_raison_sociale, q) + '</h2>' +
                '<div class="description">' +
                  '<div class="ui stackable three column grid">' +
                    '<div class="column">' +
                      '<div>SIREN : <b>' + displayValue(organization.da_siren, q) + '</b></div>' +
                      '<div>Déclaration d\'Activité : <b>' + displayValue(organization.numero_de_da, q) + '</b></div>' +
                      '<div>Numéro d\'établissement : <b>' + displayValue(organization.da_no_etab, q) + '</b></div>' +
                      '<div>Nombre de formateurs : <b>' + displayValue(organization.form_total) + '</b></div>' +
                    '</div>' +
                    '<div class="column">' + formatAdress(organization, 'postale') + '</div>' +
                    '<div class="column">' + formatAdress(organization, 'physique') + '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</article>'
}


const url = '/organizations/'
const limit = 50
const form = document.getElementById('form')
const result = document.getElementById('result')


form.addEventListener('submit', function (event) {
    event.preventDefault()
    result.innerHTML = '<div class="ui active centered inline massive loader"></div>'
    const q = document.getElementById('textinput').value
    const promise = getData(url + '?q=' + q + '&limit=' + limit)
    promise
      .then( function (r) {
        result.innerHTML = null
        if (!r.results.length) return result.insertAdjacentHTML('afterbegin', '<div>Aucun établissement de formation trouvé</div>')

        const container = document.createElement('div')
        container.classList.add('ui', 'divided', 'items')
        result.appendChild(container)
        r.results.map( function (organization) {
          return container.insertAdjacentHTML('beforeend', formatResult(organization, q))
        })

        result.insertAdjacentHTML('afterbegin', '<div><b>' + r.total + '</b> établissements de formations trouvés</div>')
        $('.formation').transition('vertical flip in')
      }
    )
  })
