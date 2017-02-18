@component('<%= elementName %>')
class MainApp extends polymer.Base {
	@property({ type: String, reflectToAttribute: true, observer: 'pageChanged' })
	page: string;
	created() {
		window.performance && performance.mark && performance.mark('<%= elementName %>.created');
		// Custom elements polyfill safe way to indicate an element has been upgraded.
		this.removeAttribute('unresolved');
		this.bindEvents();
	}
	bindEvents() {
		// Here we register our callbacks for the lifecycle events we care about
		document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener('pause', this.onPause, false);
		document.addEventListener('resume', this.onResume, false);
		document.addEventListener('backbutton', this.onBackButtonPressed);
	}
	onBackButtonPressed() {
		console.log('onBackButtonPressed');
		if (window.history.length <= 1) {
			(<any>navigator).app.exitApp();
		}
	}
	onDeviceReady() {
		console.log('onDeviceReady');

	}
	onPause() {
		// Here, we check to see if we are in the middle of taking a picture. If
		// so, we want to save our state so that we can properly retrieve the
		// plugin result in onResume(). We also save if we have already fetched
		// an image URI
		console.log('onPause');
	}
	onResume(event) {
		// Here we check for stored state and restore it if necessary. In your
		// application, it's up to you to keep track of where any pending plugin
		// results are coming from (i.e. what part of your code made the call)
		// and what arguments you provided to the plugin if relevant
		console.log('onResume');
	}
	ready() {
		console.log('<%= elementName %> ready');
	}
	@observe('routeData.page')
	routePageChanged(page) {
		this.page = page || 'home';
	}
	pageChanged(page, oldPage) {
		var resolvedPageUrl = this.resolveUrl('../pages/' + page + '/' + page + '-page.html');
		this.importHref(resolvedPageUrl, null, null, true);
	}
}
MainApp.register();