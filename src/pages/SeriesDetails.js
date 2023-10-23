import EpisodeThumbnail from '../components/EpisodeThumbnail.js';
import DetailThumbnail from '../components/DetailThumbnail.js';
import Router from '../Router.js';
import Page from './Page.js';

export default class SerieDetails extends Page {
	id;

	#episodes;

	render() {
		return /*html*/ `<section class=detailSection></section><section class=episodesSection></section><button class="everyEpisodeButton">Afficher tous les épisodes</button>`;
	}

	setId(id) {
		this.id = id;
	}

	mount(element) {
		super.mount(element);

		const elementLoading = document.querySelector('.pageContent');
		elementLoading.classList.add('is-loading');

		fetch(`https://api.tvmaze.com/shows/${this.id}`)
			.then(response => {
				if (!response.ok) {
					throw new Error(`Erreur : ${response.statusText}`);
				}
				return response.json();
			})
			.then(data => {
				document.querySelector('.detailSection').innerHTML =
					new DetailThumbnail(data).render();

				fetch(`https://api.tvmaze.com/shows/${this.id}/episodes`)
					.then(response => response.json())
					.then(data => {
						let lastEpisodes = [];
						const nbEpisodes = 5;

						for (
							let i = data.length - 1;
							i > Math.max(data.length - 1 - nbEpisodes, 0);
							i--
						) {
							lastEpisodes.push(data[i]);
						}
						this.episodes = lastEpisodes.map(
							episode => new EpisodeThumbnail(episode)
						);

						const buttons = document.querySelectorAll('.spoilButton');
						const summaries = document.querySelectorAll('.summary');

						for (let i = 0; i < buttons.length; i++) {
							buttons[i].addEventListener('click', () => {
								buttons[i].hidden = true;
								summaries[i].hidden = false;
							});
						}

						const everyEpisodeButton = document.querySelector(
							'.everyEpisodeButton'
						);
						everyEpisodeButton.addEventListener('click', () => {
							everyEpisodeButton.hidden = true;
							summaries[i].hidden = false;
						});

						elementLoading.classList.remove('is-loading');
					});
			})
			.catch(() => {
				elementLoading.classList.remove('is-loading');
				Router.displayErrorPage(
					'Série introuvable !',
					"La serie que vous cherchez n'existe pas"
				);
			});
	}

	set episodes(value) {
		this.#episodes = value;

		this.#episodes.forEach(element => {
			document.querySelector('.episodesSection').innerHTML += element.render();
		});
	}
}
