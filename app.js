// DOM elements
const form = document.querySelector("#search-form")
const input = document.querySelector("#search-term")
const msg = document.querySelector(".form-msg")
const list = document.querySelector(".cities")

// Consigue tu OpenWeather API key: https://home.openweathermap.org/users/sign_up
const apiKey ="cb85612964238da2a49fb1dc0e1a06e5"    
// KEY VIEJA "4d8fb5b93d4af21d66a2948710284366"

form.addEventListener('submit', e => {
	// Evitar el envío de formulario predeterminado
	e.preventDefault()

	// Ocultar cualquier mensaje que pueda aparecer
	msg.textContent = ''
	msg.classList.remove('visible')

	// Obtener el valor de búsqueda del input
	let inputVal = input.value

	// Comprueba si ya existe una ciudad que coincide con los criterios de búsqueda.
	const listItemsArray = Array.from(list.querySelectorAll('.cities li'))

	if (listItemsArray.length > 0) {
		const filteredArray = listItemsArray.filter(el => {
			let content = ''
			let cityName = el.querySelector('.city__name').textContent.toLowerCase()
			let cityCountry = el.querySelector('.city__country').textContent.toLowerCase()

			// Compruebe el formato <ciudad,país>
			if (inputVal.includes(',')) {
				// Si el código de país no es válido (por ejemplo, Atenas, grrrr), conserve solo el nombre de la ciudad.
				if (inputVal.split(',')[1].length > 2) {
					inputVal = inputVal.split(',')[0]

					// Obtener el contenido de la ciudad existente.
					content = cityName
				} else {
					// El código de país es válido, así que conserve tanto la ciudad como el país.
					content = `${cityName},${cityCountry}`
				}
			} else {
				// Sólo se utiliza el formato <ciudad>
				content = cityName
			}

			// Devuelve si el contenido existente coincide o no con el valor de entrada del formulario
			return content == inputVal.toLowerCase()
		})

		// Si filteredArray no está en blanco, tenemos coincidencias, por lo que mostramos un mensaje y salimos.
		if (filteredArray.length > 0) {
			msg.textContent = `Ya sabes el tiempo para ${filteredArray[0].querySelector(".city__name").textContent} ...De lo contrario, sea más específico proporcionando también el código del país.😉`;

			msg.classList.add('visible')

			form.reset()
			input.focus()

			return
		}
	}

	// AJAX magic
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric&lang=es`
	

	fetch(url)
		.then(response => response.json())
		.then(data => {
			// Si obtenemos un código 404, arroja un error
			if (data.cod == '404') {
				throw new Error(`${data.cod}, ${data.message}`)
			}
				console.log(data);
			// Desestructuramos el objeto de datos.
			const {main, name, sys, weather} = data

			// Definir la ubicación del icono
			const icon = `img/weather/${weather[0]['icon']}.svg`

			// Crear el elemento de la lista para la nueva ciudad.
			const li = document.createElement('li')

			// Definir marcado
			const markup = `
				<figure>
					<img src="${icon}" alt="${weather[0]['description']}">
				</figure>

				<div>
					<h2>${Math.round(main.temp)}<sup>°C</sup></h2>
					<p class="city__conditions">${weather[0]['description'].toUpperCase()}</p>
					<p>Humedad: ${main.humidity}%</p>
					<h3><span class="city__name">${name}</span><span class="city__country">${sys.country}</span></h3>
				</div>
			`

			// Agregue el nuevo marcado al elemento de la lista
			li.innerHTML = markup

			// Agregue el nuevo elemento de la lista a la página
			list.appendChild(li)
		})
		.catch(() => {
			msg.textContent = 'Por favor busque una ciudad válida!'
			msg.classList.add('visible')
		})

	msg.textContent = ''

	form.reset()
	input.focus()
})