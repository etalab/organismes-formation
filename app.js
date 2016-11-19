var url = '/organizations/'
var limit = 20  // ie. page size
var paginationWidth = 2  // ie. number before and after until ellipsis
var form = document.getElementById('form')
var result = document.getElementById('result')


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
  var parts = ['<h3>Adresse ' + type + '</h3>'];
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

function paginationItem(label, index, query, current, total) {
  var el = document.createElement('a')
  var disabled = index === undefined || index <= 0 || index > total
  el.classList.add('item')
  el.textContent = label
  if (index === current) el.classList.add('active')
  if (disabled) el.classList.add('disabled')
  if (!disabled && index !== current) {
      el.addEventListener('click', function(event) {
          event.preventDefault()
          fetchResult(query, index)
      })
  }
  return el
}

function pagination(data) {
  var container = document.createElement('div')
  container.classList.add('ui', 'pagination', 'compact', 'menu')
  total = Math.ceil(data['total'] / data['limit'])
  current = data['page']
  query = data['query']
  min = Math.max(1, current - paginationWidth)
  max = Math.min(total, current + paginationWidth)
  container.appendChild(paginationItem('«', data['page'] - 1, query, current, total))
  if (min > 1) container.appendChild(paginationItem(1, 1, query, current, total))
  if (min > 2) container.appendChild(paginationItem('…', undefined, query, current, total))
  for (var i = min; i <= max; i++) {
    container.appendChild(paginationItem(i, i, query, current, total))
  }
  if (max < total - 1) container.appendChild(paginationItem('…', undefined, query, current, total))
  if (max < total) container.appendChild(paginationItem(total, total, query, current, total))
  container.appendChild(paginationItem('»', data['page'] + 1, query, current, total))

  var wrapper = document.createElement('div')
  wrapper.classList.add('pagination-wrapper')
  wrapper.appendChild(container)
  return wrapper
}

function fetchResult(q, page) {
  result.innerHTML = '<div class="ui active centered inline massive loader"></div>'
  var query = url + '?q=' + q + '&limit=' + limit
  if (page) query += '&page=' + page
  var promise = getData(query)
  promise
    .then( function (r) {
      result.innerHTML = null
      if (!r.results.length) return result.insertAdjacentHTML('afterbegin', '<div>Aucun établissement de formation trouvé</div>')

      var container = document.createElement('div')
      container.classList.add('ui', 'divided', 'items')
      result.appendChild(container)
      r.results.map( function (organization) {
        return container.insertAdjacentHTML('beforeend', formatResult(organization, q))
      })

      result.insertAdjacentHTML('afterbegin', '<div><b>' + r.total + '</b> établissements de formations trouvés</div>')
      $('.formation').transition('vertical flip in')

      if (r.total > r.limit) result.appendChild(pagination(r))
    })
}

form.addEventListener('submit', function (event) {
    event.preventDefault()
    var q = document.getElementById('textinput').value
    fetchResult(q)
})
