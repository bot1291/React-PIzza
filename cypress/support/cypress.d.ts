declare namespace Cypress {
	interface Chainable {
		getWithTestId<K extends keyof HTMLElementTagNameMap>(
			value: string
		): Chainable<JQuery<HTMLElementTagNameMap[K]>>;
	}
}

declare namespace Cypress {
	interface Chainable {
		checkStorage(
			link: string,
			key: string,
			item: any
		): Chainable<Cypress.StorageByOrigin>;
	}
}