import Router from './Router';
import Equipe from './pages/Equipe';
import SeriesForm from './pages/SeriesForm';
import SerieDetails from './pages/SeriesDetails';

const seriesForm = new SeriesForm(),
	equipe = new Equipe(),
	details = new SerieDetails();

Router.routes = [
	{ path: /\//g, page: seriesForm, title: 'Nos Series' },
	{ path: /\/lequipe/g, page: equipe, title: 'Notre Equipe' },
	{ path: /\/serie-[0-9]+/g, page: details, title: '' },
];

Router.titleElement = document.querySelector('.pageTitle');
Router.contentElement = document.querySelector('.pageContent');
Router.menuElement = document.querySelector('.mainMenu');

window.onpopstate = () => {
	Router.navigate(document.location.pathname, false);
};

// deep linking
Router.navigate(document.location.pathname);

const logo = document.querySelector('.logo');
logo.addEventListener('click', event => {
	event.preventDefault();
	Router.navigate('/');
});
