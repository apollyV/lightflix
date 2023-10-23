export default class Router {
	static titleElement;
	static contentElement;
	static routes = [];

	static #menuElement;

	static set menuElement(element) {
		this.#menuElement = element;
		const links = this.#menuElement.querySelectorAll('a');
		links.forEach(link =>
			link.addEventListener('click', event => {
				event.preventDefault();
				this.navigate(event.currentTarget.getAttribute('href'));
			})
		);
	}

	static navigate(path, pushState = true) {
		let route = this.routes.find(route => {
			return path.match(route.path) == path;
		});

		if (route) {
			if (route.title != '') {
				this.titleElement.innerHTML = `<h1>${route.title}</h1>`;
			} else {
				this.titleElement.innerHTML = '';
			}

			if (path.includes('/serie-')) {
				route.page.setId(path.split('-')[1]);
			}

			this.contentElement.innerHTML = route.page.render();
			route.page.mount?.(this.contentElement);

			const previousMenuLink = this.#menuElement.querySelector('.active'),
				newMenuLink = this.#menuElement.querySelector(`a[href="${path}"]`);
			previousMenuLink?.classList.remove('active');
			newMenuLink?.classList.add('active');

			if (pushState) {
				window.history.pushState(null, null, path);
			}
		}

		if (!route) {
			Router.displayErrorPage(
				'Page introuvable !',
				"L'url que vous avez demandé n'est pas valide"
			);
		}
	}

	static displayErrorPage(title, message) {
		this.titleElement.innerHTML = `<h1>${title}</h1>`;
		this.contentElement.innerHTML = /*html*/ `<h3>${message}</h3><p>Pour vous calmer, voici un petit jeu codé en Javascript il y a quelque temps par un des membres du groupe (quel bg)</p><style scoped >
			iframe {height:700px; width:1000px}
			</style><iframe src="https://editor.p5js.org/Noway/full/650cnr2WN"></iframe>`;
	}
}
