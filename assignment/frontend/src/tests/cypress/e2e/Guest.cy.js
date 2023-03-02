/** @format */

import { dataTestIds } from '../../constants/components.js';
import { authMsg, cartMsg, invalidAuthMsg } from '../../constants/redux.js';
import { getAllProducts, getAllUsers } from '../../mocks/db.js';
import { LOGIN_PASSWORD } from '../../mocks/handlers.js';
import { getElement } from '../utils/getElement.js';
const { clickId, linkId, listId, valueId, selectId, inputId, containerId } =
	dataTestIds;

import {
	expectNotification,
	testNavigationIsFor,
	navigateToPage,
	testPathIsCorrect,
	logOut,
} from '../utils/testHelpers.js';

// const products = getAllProducts();
// const product = products[0];

beforeEach(() => {
	cy.visit('/');
});

describe('END-TO-END - GUEST', () => {
	describe('Navigation and Other UI Elements', () => {
		it('Navigation is shown correctly', () => {
			testNavigationIsFor('guest');
		});
	});

	describe('Shopping cart/Products', () => {
		let productsElement;
		let products;
		let product = getAllProducts()[0];

		it('Should have initially empty-cart, no cart-item-container/order-button', () => {
			navigateToPage('cart');
			const cartElement = getElement(containerId.main);
			cartElement.hasElement(containerId.empty);
			cartElement.doesNotHaveElement(clickId.submit);
		});

		it('Should not be able to add a new product: only admin can do that. Has the same amount of add-buttons as there are products', () => {
			products = getAllProducts();
			navigateToPage('products');

			const productsElement = getElement(containerId.main);
			cy.get(`[data-testid=${clickId.add}]`).should(
				'have.length',
				products.length
			);
			productsElement.doesNotHaveElement(containerId.form);
		});

		it('Should be able to view all products', () => {
			navigateToPage('products');
			products = getAllProducts();
			productsElement = getElement(containerId.main);
			productsElement.checkChildCount('list-item', products.length);
		});
		it('Should be able to add to cart', () => {
			navigateToPage('products');
			productsElement = getElement(containerId.main);
			const productElement = productsElement.getChildElement(
				containerId.listItem(product.id)
			);
			productElement.click(clickId.add);
			expectNotification(cartMsg.add);
			navigateToPage('cart');

			const cartElement = getElement(containerId.main);
			cartElement.doesNotHaveElement(containerId.empty);
			cartElement.hasElement(clickId.submit);
			cartElement.checkChildCount(`list-item`, 1);
		});

		describe('Controlling cart items', () => {
			let productElement;
			let productsElement;
			let cartElement;
			let cartItemElement;
			let product;

			beforeEach(() => {
				cy.visit('/');
				navigateToPage('products');
				products = getAllProducts();
				product = products[0];
				productsElement = getElement(containerId.main);
				const productElement = productsElement.getChildElement(
					containerId.listItem(product.id)
				);
				productElement.click(clickId.add);

				navigateToPage('cart');
				cartElement = getElement(containerId.main);
				cartElement.doesNotHaveElement(containerId.empty);
				cartElement.hasElement(clickId.submit);
				cartElement.checkChildCount(`list-item`, 1);
				cartItemElement = cartElement.getChildElement(
					containerId.listItem(product.id)
				);
				cartItemElement.hasElement(valueId.quantity);
				cartItemElement.checkText(valueId.quantity, 1);
			});

			it('Should update the quantity in the cart when same product is added multiple times', () => {
				navigateToPage('products');
				productElement = productsElement.getChildElement(
					containerId.listItem(product.id)
				);

				const randomClickNumber = Math.floor(Math.random() * 10 + 1);
				for (let i = 1; i < randomClickNumber; i++) {
					productElement.click(clickId.add);
				}

				navigateToPage('cart');
				cartItemElement.hasElement(valueId.quantity);
				cartItemElement.checkText(valueId.quantity, randomClickNumber);
			});

			it("Should be able to increase product's quantity in the cart", () => {
				cartItemElement.click(clickId.add);
				cartItemElement.checkText(valueId.quantity, 2);
			});

			it("Should be able to decrease product's quantity in the cart", () => {
				cartItemElement.click(clickId.add);
				cartItemElement.checkText(valueId.quantity, 2);
				cartItemElement.click(clickId.reduce);
				cartItemElement.checkText(valueId.quantity, 1);
			});

			it('Should be able to remove a product from the cart by clicking minus-button when amount is 1', () => {
				cartItemElement.click(clickId.reduce);
				cartElement.hasElement(containerId.empty);
			});

			it('Should direct a guest to the login page after clicking the order button', () => {
				cartElement.click(clickId.submit);
				testPathIsCorrect('/login');
			});
		});
	});
	describe('Registering a new user', () => {
		let email;
		let password;
		let name;
		let registerElement;
		beforeEach(() => {
			email = 'example.email@gmail.com';
			password = '1234567890';
			name = 'Example Name';
			navigateToPage('register');
			registerElement = getElement(containerId.form);
		});

		it('Should be able to register a valid new user successfully as a new customer', () => {
			registerElement.type(inputId.name, name);
			registerElement.type(inputId.email, email);
			registerElement.type(inputId.password, password);
			registerElement.type(inputId.passwordConfirmation, password);
			registerElement.click(clickId.submit);

			expectNotification(authMsg.welcome(name));
			testPathIsCorrect('/');
			testNavigationIsFor('customer');
			logOut();
		});
		it('Should not be able to register a new user with an invalid email', () => {
			registerElement.type(inputId.name, name);
			registerElement.type(inputId.email, 'email@email');
			registerElement.type(inputId.password, password);
			registerElement.type(inputId.passwordConfirmation, password);
			registerElement.click(clickId.submit);

			expectNotification(invalidAuthMsg.email);
			testPathIsCorrect('/register');
		});
		it('Should not be able to register a new user if the password is shorter than 10 numbers', () => {
			registerElement.type(inputId.name, name);
			registerElement.type(inputId.email, email);
			registerElement.type(inputId.password, '123');
			registerElement.type(inputId.passwordConfirmation, '123');
			registerElement.click(clickId.submit);

			expectNotification(invalidAuthMsg.password);
			testPathIsCorrect('/register');
		});
		it('Should not be able to register a new user if the password and password confirmation do not match', () => {
			registerElement.type(inputId.name, name);
			registerElement.type(inputId.email, email);
			registerElement.type(inputId.password, password);
			registerElement.type(inputId.passwordConfirmation, '123456789');
			registerElement.click(clickId.submit);

			expectNotification(invalidAuthMsg.passwordConfirmation);
			testPathIsCorrect('/register');
		});
		it('Should not be able to register a new user if the name is shorter than 3 letters', () => {
			registerElement.type(inputId.name, 'te');
			registerElement.type(inputId.email, email);
			registerElement.type(inputId.password, password);
			registerElement.type(inputId.passwordConfirmation, password);
			registerElement.click(clickId.submit);

			expectNotification(invalidAuthMsg.name);
			testPathIsCorrect('/register');
		});
		it('Should not be able to register a new user if email is already in use', () => {
			const user = getAllUsers()[0];
			registerElement.type(inputId.name, name);
			registerElement.type(inputId.email, user.email);
			registerElement.type(inputId.password, password);
			registerElement.type(inputId.passwordConfirmation, password);

			registerElement.click(clickId.submit);

			expectNotification('User with the same email address already exists.');
			testPathIsCorrect('/register');
		});
	});
	describe('Logging in', () => {
		const customer = getAllUsers().find((user) => user.role === 'customer');
		const admin = getAllUsers().find((user) => user.role === 'admin');
		let loginElement;
		beforeEach(() => {
			navigateToPage('login');

			loginElement = getElement(containerId.form);
		});

		afterEach(() => {
			testNavigationIsFor('guest');
		});

		it('Should be able to log in as an existing customer', () => {
			loginElement.type(inputId.email, customer.email);
			loginElement.type(inputId.password, LOGIN_PASSWORD);
			loginElement.click(clickId.submit);
			expectNotification(authMsg.welcomeBack);
			testPathIsCorrect('/');
			testNavigationIsFor('customer');
			logOut();
		});
		it('Should be able to log in as an existing admin', () => {
			loginElement.type(inputId.email, admin.email);
			loginElement.type(inputId.password, LOGIN_PASSWORD);
			loginElement.click(clickId.submit);
			expectNotification(authMsg.welcomeBack);
			testPathIsCorrect('/');
			testNavigationIsFor('admin');
			logOut();
		});
		it('Should not be able to log in with an invalid email', () => {
			navigateToPage('login');
			loginElement.type(inputId.email, 'email@email');
			loginElement.type(inputId.password, LOGIN_PASSWORD);
			loginElement.click(clickId.submit);
			expectNotification(invalidAuthMsg.email);
			testPathIsCorrect('/login');
		});
		it('Should not be able to log in with an invalid password (too short)', () => {
			const customer = getAllUsers().find((user) => user.role === 'customer');
			navigateToPage('login');
			loginElement.type(inputId.email, customer.email);
			loginElement.type(inputId.password, '2short');
			loginElement.click(clickId.submit);
			expectNotification(invalidAuthMsg.password);
			testPathIsCorrect('/login');
		});
		it("Should not be able to log in with an email that doesn't exist in the backend", () => {
			navigateToPage('login');
			loginElement.type(inputId.email, 'nonExistingEmail@email.com');
			loginElement.type(inputId.password, LOGIN_PASSWORD);
			loginElement.click(clickId.submit);
			expectNotification('Login failed. Check email and password.');
			testPathIsCorrect('/login');
		});
		it('Should not be able to log in with an incorrect password', () => {
			navigateToPage('login');
			loginElement.type(inputId.email, customer.email);
			loginElement.type(inputId.password, 'wrongPassword');
			loginElement.click(clickId.submit);
			expectNotification('Login failed. Check email and password.');
			testPathIsCorrect('/login');
		});
	});
});
