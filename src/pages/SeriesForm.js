import Router from '../Router.js';
import Page from './Page.js';
import SerieThumbnail from '../components/SerieThumbnail';

export default class SeriesForm extends Page {
	#series;

	render() {
		return /*html*/ `
        <form class="SeriesForm">
            <label class="searchBar">
                <input placeholder=" "  class="searchBarInput" type="text" name="name" autocomplete="new-password">
            </label>	
            <br>
			<center>
            	<button type="submit">Rechercher</button>
			</center>
			<ul class="triSection" id="">
				<li class="triPar"><a href="#">tri par :</a>
					<ul class="listTri">
						<li class="triElement"><a id="pertinence">pertinence</a></li>
						<li class="triElement center"><a id="note">note décroissante</a></li>
						<li class="triElement"><a id="date">date</a></li>
					</ul>
				</li>
				<a id="inverserTri" class="noninverse">
					<svg style="transform:translateY(4px)" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-arrow-down-up" viewBox="0 0 16 16">
						<path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"/>
					</svg>
					Inverser
				</a>
			</ul>
		</form>
		
		<div class="seriesList"></div>`;
	}

	mount(element) {
		super.mount(element);

		const form = document.querySelector('form', this.element);
		form.addEventListener('submit', event => {
			event.preventDefault();
			document.querySelector('#date').setAttribute('class', 'inactive');
			document.querySelector('#note').setAttribute('class', 'inactive');
			document.querySelector('#pertinence').setAttribute('class', 'inactive');
			document.querySelector('#inverserTri svg').setAttribute('fill', 'white');
			document
				.querySelector('#inverserTri')
				.setAttribute('class', 'noninverse');
			this.submit();
		});

		const pertinence = document.querySelector('#pertinence');
		pertinence.addEventListener('click', () => {
			this.submit();
			document.querySelector('#date').setAttribute('class', 'inactive');
			document.querySelector('#note').setAttribute('class', 'inactive');
			document.querySelector('#inverserTri svg').setAttribute('fill', 'white');
			document
				.querySelector('#inverserTri')
				.setAttribute('class', 'noninverse');
			pertinence.setAttribute('class', 'active');
		});

		const note = document.querySelector('#note');
		note.addEventListener('click', () => {
			this.series = this.#series.sort(SerieThumbnail.compareNote);
			document.querySelector('#pertinence').setAttribute('class', 'inactive');
			document.querySelector('#date').setAttribute('class', 'inactive');
			document.querySelector('#inverserTri svg').setAttribute('fill', 'white');
			document
				.querySelector('#inverserTri')
				.setAttribute('class', 'noninverse');
			note.setAttribute('class', 'active');
		});

		const date = document.querySelector('#date');
		date.addEventListener('click', () => {
			this.series = this.#series.sort(SerieThumbnail.compareDate);
			document.querySelector('#pertinence').setAttribute('class', 'inactive');
			document.querySelector('#note').setAttribute('class', 'inactive');
			document.querySelector('#inverserTri svg').setAttribute('fill', 'white');
			document
				.querySelector('#inverserTri')
				.setAttribute('class', 'noninverse');
			date.setAttribute('class', 'active');
		});

		const inverserTri = document.querySelector('#inverserTri');
		inverserTri.addEventListener('click', () => {
			this.series = this.#series.reverse();
			if (inverserTri.getAttribute('class') == 'noninverse') {
				document
					.querySelector('#inverserTri svg')
					.setAttribute('fill', 'rgb(199, 0, 0)');
				inverserTri.setAttribute('class', 'inverse');
			} else {
				document
					.querySelector('#inverserTri svg')
					.setAttribute('fill', 'white');
				inverserTri.setAttribute('class', 'noninverse');
			}
		});

		this.submit();
	}

	/**
	 * Retourne la valeur saisie par l'utilisateur dans le champ de formulaire
	 * dont le nom correspond à `inputName`
	 * @param {string} inputName nom du champ de formulaire
	 */
	getInputValue(inputName) {
		return this.element.querySelector(`input[name="${inputName}"]`)?.value;
	}
	/**
	 * Récupère les infos saisies par l'utilisateur, les vérifie
	 * puis les envoie au serveur REST
	 */
	submit() {
		const name = this.getInputValue('name');

		const elementLoading = document.querySelector('.pageContent');
		elementLoading.classList.add('is-loading');
		/*
			La classe "is-loading" ajoutée ici n'a pas l'air d'affecter l'affichage et nous ne comprenons pas pourquoi :'(
		*/

		if (name == '') {
			fetch('https://api.tvmaze.com/shows')
				.then(response => response.json())
				.then(data => {
					debugger;
					const randomFilms = [];
					const alreadyPicked = [];

					for (let i = 0; i < 10; i++) {
						let rnd;
						do {
							rnd = parseInt(Math.random() * data.length, 10);
						} while (alreadyPicked.includes(rnd));

						randomFilms.push(data[rnd]);
						alreadyPicked.push(rnd);
					}

					this.series = randomFilms.map(serie => new SerieThumbnail(serie));
				})
				.then(elementLoading.classList.remove('is-loading'));
		} else {
			fetch(`https://api.tvmaze.com/search/shows?q=${name}`)
				.then(response => response.json())
				.then(data => {
					this.series = data.map(serie => new SerieThumbnail(serie.show));
				})
				.then(elementLoading.classList.remove('is-loading'));
		}
	}

	set series(value) {
		this.#series = value;

		const seriesList = document.querySelector('.seriesList');
		this.children = this.#series;

		if (seriesList && this.children) {
			seriesList.innerHTML = '';
			this.children.forEach(element => {
				seriesList.innerHTML += element.render();
			});
		}

		const serieThumbnails = document.querySelectorAll('.serieThumbnail a');
		serieThumbnails.forEach(a => {
			a.addEventListener('click', event => {
				event.preventDefault();
				Router.navigate('/' + a.getAttribute('href').split('/')[3]);
			});
		});
	}
}
