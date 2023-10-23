import Component from './Component.js';

export default class DetailThumbnail extends Component {
	constructor(show) {
		super('article', { name: 'class', value: 'serieThumbnail' }, null);

		this.id = show.id;
		let img;
		try {
			img = show.image.medium;
		} catch (error) {
			img = '../../ressources/not-found.png';
		}
		this.image = img;
		this.name = show.name;
		this.genres = show.genres;
		this.date = show.premiered;
		this.description = show.summary;
		this.note = show.rating.average;

		this.website = show.officialSite;
	}

	render() {
		let page = `<article class=detailThumbnail>`;
		page += `<div class="detailBanner">`;
		page += `<img src=${this.image} alt=${this.name} >`;
		page += `<div class="writedDetails">`;
		if (this.name) page += `<h1>${this.name}</h1>`;
		if (this.website)
			page += `<p>Site officiel : <a href=${this.website} target=_blank >${this.website}</a></p>`;

		if (this.genres) {
			page += '<h3>';
			for (let i = 0; i < this.genres.length; i++) {
				page += this.genres[i];
				if (i != this.genres.length - 1) page += ' - ';
			}

			page += '</h3>';
		}
		if (this.date) page += `<h2>${this.date}</h2>`;

		if (this.note)
			page += `<div class="progress serieText">
						<div class="progress-bar" role="progressbar" style="width: ${
							this.note * 10
						}%" aria-valuenow="${
				this.note * 10
			}" aria-valuemin="0" aria-valuemax="100">${this.note}/10</div></div>`;
		if (this.description) {
			page += `</div></div><p class="serieText">${this.description}</p>`;
		} else {
			page += `</div></div>`;
		}
		return page + '</article>';
	}
}
