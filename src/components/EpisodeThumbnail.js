import Component from './Component';

export default class EpisodeThumbnail extends Component {
	constructor(episode) {
		super('article', { name: 'class', value: 'episodeThumbnail' }, null);

		this.title = episode.name;
		let img;
		try {
			img = episode.image.medium;
		} catch (error) {
			img = '../../ressources/episode-not-found.png';
		}
		this.image = img;
		this.date = episode.airdate;
		this.summary = episode.summary;

		this.season = episode.season;
		this.number = episode.number;
	}

	render() {
		let page = `<article class=episodeThumbnail><img class="episodeElement"`;
		page += `<img src=${this.image} alt=${this.title} >`;

		if (this.title) page += `<h1 class="episodeElement">${this.title}</h1>`;
		if (this.season != undefined && this.number != undefined)
			page += `<p class="episodeElement">Saison ${this.season}, Episode ${this.number}</p>`;

		if (this.date) page += `<h2 class="episodeElement">${this.date}</h2>`;
		if (this.summary)
			page += `<button class="spoilButton">Dévoiler le résumé</button> <div class=summary hidden>${this.summary}<div>`;

		return page + '</article>';
	}

	static formData(data) {
		return data.map(episode => {
			let image;
			try {
				image = episode.image.medium;
			} catch (error) {
				image = null;
			}

			return new EpisodeThumbnail(
				episode.name,
				image,
				episode.airdate,
				episode.summary
			);
		});
	}
}
