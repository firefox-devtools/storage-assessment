window.addEventListener('load', function() {

	class Provider {
		constructor() {
			this.providerName = 'default';
		}

		set providerName(value) {
			this.name = `provider-${value}`;
		}

		setupStore() {
			console.error('default setupStore');
		}

		emptyStore() {
			console.error(this.name, 'default emptyStore');
		}

		async insertDefaultsIntoStore() {
			// Insert a reasonably big amount of initial records to
			// 'instigate pagination' and/or scrolling in the panel
			let promises = [];
			for(let i = 0; i < 100; i++) {
				let padded = StringFormat.pad(i, 3, '0');
				promises.push(this.setItem(`test${padded}`, `Value ${i}`));
			}
			return Promise.all(promises);
		}

		async reset() {
			this.setupStore();
			console.time('empty and insert records');
			await this.emptyStore();
			await this.insertDefaultsIntoStore();
			console.timeEnd('empty and insert records');
		}

		async setItem(key, value) {
			console.error(this.name, 'default setItem');
		}


	}

	class IndexedDBProvider extends Provider {
		constructor() {
			super();
			this.providerName = 'IndexedDB';
		}

		setupStore() {
			this.store = localforage.createInstance({
				name: this.name
			});

			this.store.config({
				driver: localforage.INDEXEDDB
			});
		}

		async emptyStore() {
			return this.store.clear();
		}

		async setItem(key, value) {
			return this.store.setItem(key, value);
		}
	}

	

	// ----
	
	let providers = [];

	initialise();

	function initialise() {	
		
		// Create providers
		providers = [IndexedDBProvider].map((cla) => {
			return new cla();
		});

		// for each provider
		providers.forEach((pro) => {
			// empty records and initialise default data
			pro.reset();
		});
	}

});
