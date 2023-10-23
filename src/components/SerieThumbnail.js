import Component from './Component.js';

export default class SerieThumbnail extends Component {
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
		this.date = show.premiered;
		this.description = show.summary;
		this.note = show.rating.average;
	}

	render() {
		let page = `<article class=serieThumbnail><a href= "http://localhost:8000/serie-${this.id}">`;

		page += `<img src=${this.image} alt=${this.name} >`;

		if (this.name) page += `<h1 class="serieText">${this.name}`;
		if (this.date) {
			page += `<h2 class="serieText">${this.date}</h2></h1>`;
		} else {
			page += `</h1>`;
		}
		if (this.note)
			page += `<div class="progress serieText">
						<div class="progress-bar" role="progressbar" style="width: ${
							this.note * 10
						}%" aria-valuenow="${
				this.note * 10
			}" aria-valuemin="0" aria-valuemax="100">${this.note}/10</div>
					 </div>`;
		if (this.description) {
			if (this.description.length > 500) {
				page += `<p class="serieText">${this.description.substring(
					0,
					500
				)} [...]</p>`;
			} else {
				page += `<p class="serieText">${this.description}</p>`;
			}
		}
		return page + '</a></article>';
	}

	static compareDate(serie1, serie2) {
		const d1 = serie1.date,
			d2 = serie2.date;

		if (d1 == undefined) return 1;
		if (d2 == undefined) return -1;

		const date1split = d1.split('-');
		const date2split = d2.split('-');

		for (let i = 0; i < date1split.length; i++) {
			let value = parseInt(date2split[i]) - parseInt(date1split[i]);
			if (value != 0) {
				return value;
			}
		}
		return 0;
	}

	static compareNote(serie1, serie2) {
		const noteSerie1 = serie1.note;
		const noteSerie2 = serie2.note;

		if (noteSerie1 == undefined) return 1;
		if (noteSerie2 == undefined) return -1;

		return parseFloat(noteSerie2) - parseFloat(noteSerie1);
	}
}
