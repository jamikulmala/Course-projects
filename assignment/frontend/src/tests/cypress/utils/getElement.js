/** @format */

export const getElement = (elementId) => {
	cy.get(`[data-testid="${elementId}"]`).as(elementId);
	// const elementId = elementId + '-component';
	return {
		selectFromDropdown: (dropdownTestId, optionText) => {
			cy.get(`@${elementId}`)
				.find(`[data-testid="${dropdownTestId}"]`)
				.select(optionText, {
					force: true,
				});
		},
		debug: () => {
			// Print the component to the console
			// component.
			cy.get(`@${elementId}`).debug();
		},
		exists: () => {
			cy.get(`@${elementId}`).should('exist');
		},
		doesNotExist: () => {
			cy.get(`[data-testid="${elementId}-component"]`).should('not.exist');
			// cy.get(`@${elementId}`).should('not.exist');
		},
		checkText: (childElementId, text) => {
			cy.get(`@${elementId}`)
				.find(`[data-testid="${childElementId}"]`)
				.should('contain.text', text);
		},
		checkValue: (childElementId, value) => {
			cy.get(`@${elementId}`)
				.find(`[data-testid="${childElementId}"]`)
				.should('have.value', value);
		},
		getText: (childElementId) => {
			// return the text content of the element
			return cy
				.get(`@${elementId}`)
				.find(`[data-testid="${childElementId}"]`)
				.invoke('text');
		},
		getChildElement: (childElementId) => {
			return getElement(childElementId);
		},
		checkChildCount: (startingId, count) => {
			// check the number of children whose testid starts with the given startingId and ends with "-component"
			cy.get(`@${elementId}`)
				.find(`[data-testid^="${startingId}-"][data-testid$=-container]`)
				.should('have.length', count);
			// component.get(`[data-testid^="${startingId}"]`).should('have.length', count);
		},
		doesNotHaveElement: (childElementId) => {
			cy.get(`@${elementId}`)
				.find(`[data-testid="${childElementId}"]`)
				.should('not.exist');
		},
		hasElement: (childElementId) => {
			return cy
				.get(`@${elementId}`)
				.find(`[data-testid="${childElementId}"]`)
				.should('exist');
		},
		click: function (childElementId) {
			// If passed a child element id, click that element
			if (childElementId) {
				cy.get(`@${elementId}`)
					.find(`[data-testid="${childElementId}"]`)
					.should('exist')
					.click();
			} else {
				// Otherwise, click the element itself
				cy.get(`@${elementId}`).should('exist').click();
			}

			// cy.get(`@${elementId}`).find(`[data-testid="${childElementId}"]`)
		},
		type: function (childElementId, text) {
			// Check it exists
			cy.get(`@${elementId}`)
				.find(`[data-testid="${childElementId}"]`)
				.should('exist');
			return cy
				.get(`@${elementId}`)
				.find(`[data-testid="${childElementId}"]`)
				.type(text);
		},
	};
};
