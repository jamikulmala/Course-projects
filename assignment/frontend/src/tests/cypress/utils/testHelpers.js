/** @format */

import { dataTestIds } from '../../constants/components.js';
import { authMsg } from '../../constants/redux.js';
import { getElement } from './getElement.js';

const allLinks = [
	'Home',
	'Products',
	'Login',
	'Register',
	'Cart',
	'Orders',
	'Profile',
];

const { clickId, linkId, listId, valueId, selectId, inputId, containerId } =
	dataTestIds;

const navbarShouldShow = (availableLinks) => {
	const navbar = getElement(containerId.navbar);
	navbar.exists();
	const notAvailableLinks = allLinks.filter(
		(link) => !availableLinks.includes(link)
	);
	availableLinks.forEach((link) => {
		// Should be visible and contain text of link and be a link to the correct path
		navbar.checkText(linkId[link.toLowerCase()], link);
	});

	notAvailableLinks.forEach((link) => {
		navbar.doesNotExist(linkId[link.toLowerCase()]);
	});
};

export const testNavigationIsFor = (role = 'guest') => {
	const links = ['Home', 'Products'];

	switch (role) {
		case 'customer':
			links.push('Orders', 'Cart');
			break;
		case 'admin':
			links.push('Orders', 'Users');
			break;
		default:
			links.push('Login', 'Cart', 'Register');
	}

	navbarShouldShow(links);
};

export const visitPath = (path) => {
	cy.visit(path);
	testPathIsCorrect(path);
};

export const navigateToPage = (link) => {
	cy.get(`[data-testid="${link.toLowerCase()}-link"]`).click();
	// cy.url().should('include', allNavLinks[link]);
	testPathIsCorrect('/' + link);
};

export const login = ({ email, password }) => {
	testNavigationIsFor('guest');
	navigateToPage('login');
	cy.wait(100);
	const loginComponent = getElement(containerId.form);
	loginComponent.type(inputId.email, email);
	loginComponent.type(inputId.password, password);
	loginComponent.click(clickId.submit);
	getElement(containerId.main);

	testPathIsCorrect('/');
	expectNotification(authMsg.welcomeBack);
};

export const testRoleIsCorrect = (role = 'guest') => {
	const profileComponent = getElement(containerId.profile);
	profileComponent.checkText(valueId.role, role);
};

export const expectMany = (compName, items) => {
	cy.findAllByTestId(`${compName}-component`).should(
		'have.length',
		items.length
	);
};

// export const inspectSingle = (itemName, items, itemToInspect = items[0]) => {
// 	// Finding the desired component
// 	const index = cy.find('[data-testid="inspect-link"]').findIndex((element) => {
// 		const pathArray = element.href.split('/');
// 		const id = pathArray[pathArray.length - 1];
// 		return id === itemToInspect.id;
// 	});

// 	// Clicking the desired components inspect-link
// 	cy.find('[data-testid="inspect-link"]')[index].click();
// 	// We should now be viewing a page with a single item without its list component.
// 	cy.get(`[data-testid="${itemName}s-component"]`).should('not.exist');

// 	// Let's make sure the path is correct
// 	cy.url().should('include', `/${itemName}s/${itemToInspect.id}`);
// 	// And a single item is rendered
// 	cy.get(`[data-testid="${itemName}-component"]`).should('be.visible');
// };

export const expectNotification = (message) => {
	// The text should contain the message but does not have to be limited to it
	const notification = getElement(containerId.notification);
	notification.checkText(valueId.description, message);
};

export const logOut = () => {
	try {
		getElement(containerId.navbar).click(clickId.logout);
		// expectNotification('User logged out!');
		testNavigationIsFor('guest');
	} catch (e) {
		console.log('Logout failed, trying again');
	}
};

export const testPathIsCorrect = (correctPath) => {
	cy.url().should('include', correctPath);
	// cy.url().should('include', correctPath);
};

export const selectFromDropdown = (dropdownTestId, optionText) => {
	cy.get(`[data-testid="${dropdownTestId}"]`).select(optionText, {
		force: true,
	});
};

// Currently not in use
export const getStore = () => {
	const store = cy.window().its('store');
	return {
		dispatch: (type, payload) => {
			store.invoke('dispatch', { type, payload });
		},
	};
};

export function interceptIndefinitely(requestMatcher, response) {
	let sendResponse = () => {};
	// Create a Promise and capture a reference to its resolve function so that we can resolve it when we want to:
	const trigger = new Promise((resolve) => {
		sendResponse = resolve;
	});

	// Intercept requests to the URL we are loading data from and do not let the response occur until our above Promise is resolved
	cy.intercept(requestMatcher, (request) => {
		return trigger.then(() => {
			return request.reply(response);
		});
	});

	return { sendResponse };
}
