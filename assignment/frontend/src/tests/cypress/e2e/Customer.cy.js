/** @format */

import { dataTestIds } from '../../constants/components.js';
import { cartMsg, productMsg, userMsg } from '../../constants/redux.js';
import { getAllOrders, getAllProducts, getAllUsers } from '../../mocks/db.js';
import { getElement } from '../utils/getElement.js';
const { clickId, linkId, listId, valueId, selectId, inputId, containerId } =
	dataTestIds;
import {
	expectNotification,
	login,
	logOut,
	navigateToPage,
	testNavigationIsFor,
	testPathIsCorrect,
} from '../utils/testHelpers.js';

const credentials = getAllUsers().reduce((credentials, user) => {
	if (user.role === 'customer') {
		credentials[user.name.toLowerCase()] = {
			id: user.id,
			email: user.email,
			password: '1234567890',
		};
	}

	return credentials;
}, {});

const products = getAllProducts();
const product = products[0];
const users = getAllUsers();
const user = users[0];
const orders = getAllOrders();
const order = orders[0];

describe('END-TO-END - CUSTOMER', () => {
	beforeEach(() => {
		// cy.stubServer();

		cy.visit('/');
	});

	describe('Navigation and Other UI Elements', () => {
		it('Navigation is shown correctly after successful customer login', () => {
			login(credentials.customer);
			testNavigationIsFor('customer');
			logOut();
		});

		it('Navigation is not updated if login fails due to incorrect credentials', () => {
			const email = 'fake@email.com';
			const password = '1234567890';

			navigateToPage('login');

			const loginElement = getElement(containerId.form);
			loginElement.type(inputId.email, email);
			loginElement.type(inputId.password, password);
			loginElement.click(clickId.submit);

			// expectNotification(/login failed/i);
			expectNotification('Login failed. Check email and password.');
			testPathIsCorrect('/login');

			// Test that navigation is not updated.
			testNavigationIsFor('guest');
		});
	});

	describe('Shopping cart/Products', () => {
		let productsElement;
		let products;
		beforeEach(() => {
			login(credentials.customer);
			navigateToPage('products');
			products = getAllProducts();
			productsElement = getElement(containerId.main);
		});
		afterEach(() => {
			logOut();
		});
		it('Should have initially empty-cart, no order-button', () => {
			navigateToPage('cart');
			const cartElement = getElement(containerId.main);
			cartElement.hasElement(containerId.empty);
			cartElement.checkChildCount('list-item', 0);
			cartElement.doesNotHaveElement(clickId.submit);
		});

		it('Should not be able to add a new product: only admin can do that. Has the same amount of add-buttons as there are products', () => {
			cy.get(`[data-testid=${clickId.add}]`).should(
				'have.length',
				products.length
			);
			productsElement.doesNotHaveElement(containerId.form);
		});

		it('Should be able to view all products', () => {
			productsElement.checkChildCount('list-item', products.length);
		});
		it('Should be able to add a new item to cart', () => {
			const productElement = productsElement.getChildElement(
				containerId.listItem(product.id)
			);
			productElement.click(clickId.add);
			navigateToPage('cart');

			const cartElement = getElement(containerId.main);
			cartElement.doesNotHaveElement(containerId.empty);
			cartElement.hasElement(clickId.submit);
			cartElement.checkChildCount('list-item', 1);
			// Expect only one cart item
		});

		describe('Controlling cart items', () => {
			let productElement;
			let cartElement;
			let cartItemElement;
			beforeEach(() => {
				productElement = productsElement.getChildElement(
					containerId.listItem(product.id)
				);
				productElement.click(clickId.add);

				navigateToPage('cart');

				cartElement = getElement(containerId.main);
				cartElement.doesNotHaveElement(containerId.empty);
				cartElement.hasElement(clickId.submit);
				cartElement.checkChildCount('list-item', 1);
				cartItemElement = cartElement.getChildElement(
					containerId.listItem(product.id)
				);
			});

			it('Should update the quantity in the cart when same product is added multiple times', () => {
				navigateToPage('products');
				// Add product random number of times
				const randomClickNumber = Math.floor(Math.random() * 10 + 1);
				for (let i = 1; i < randomClickNumber; i++) {
					productElement.click(clickId.add);
				}
				navigateToPage('cart');
				// Expect quantity to be equal to the number of times the product was added
				cartItemElement.checkText(valueId.quantity, randomClickNumber);
			});

			it("Should be able to increase product's quantity in the cart", () => {
				cartItemElement.checkText(valueId.quantity, 1);
				cartItemElement.click(clickId.add);
				cartItemElement.checkText(valueId.quantity, 2);
			});

			it("Should be able to decrease product's quantity in the cart", () => {
				cartItemElement.checkText(valueId.quantity, 1);
				cartItemElement.click(clickId.add);
				cartItemElement.checkText(valueId.quantity, 2);
				cartItemElement.click(clickId.reduce);
				cartItemElement.checkText(valueId.quantity, 1);
			});

			it('Should be able to remove a product from the cart', () => {
				cartItemElement.checkText(valueId.quantity, 1);
				cartItemElement.click(clickId.reduce);
				cartElement.hasElement(containerId.empty);
			});

			it('Should be able to empty shopping cart after successful placing of an order', () => {
				cartItemElement.checkText(valueId.quantity, 1);
				cartElement.click(clickId.submit);
				cartElement.hasElement(containerId.empty);
			});
		});
	});

	describe('Handling order page', () => {
		afterEach(() => {
			logOut();
			// Expect to be redirected to login page
			testPathIsCorrect(`/login`);
			// Expect to see login component
			getElement(containerId.form).exists();
		});
		describe('Has no orders', () => {
			let noOrdersCustomer;
			let ordersElement;
			beforeEach(() => {
				noOrdersCustomer = credentials.customer3;
				login(noOrdersCustomer);
				navigateToPage('orders');
				ordersElement = getElement(containerId.main);
			});
			it('Should list no orders', () => {
				ordersElement.exists();
				ordersElement.getChildElement(containerId.empty).exists();
				ordersElement.checkChildCount('list-item', 0);
			});
		});
		describe('Has Orders', () => {
			let ordersElement;
			let orders;
			let products;
			beforeEach(() => {
				login(credentials.customer);
				navigateToPage('orders');
				orders = getAllOrders(credentials.customer.id);
				ordersElement = getElement(containerId.main);
				products = getAllProducts();
			});

			it('Should be able to list only the customers own orders', () => {
				ordersElement.checkChildCount('list-item', orders.length);
			});

			it('Should be able to inspect the customers own orders, which shows all items in an order', () => {
				const order = orders[0];
				const orderElement = ordersElement.getChildElement(
					containerId.listItem(order.id)
				);
				orderElement.click(linkId.inspect);
				testPathIsCorrect(`/orders/${order.id}`);
				const inspectOrderElement = getElement(containerId.inspect);
				inspectOrderElement.exists();
				inspectOrderElement.checkChildCount('list-item', order.items.length);
			});

			it('After placing an order the new order is listed on the orders page', () => {
				navigateToPage('products');
				const { id: productId, name, price } = products.pop();
				const productElement = getElement(containerId.listItem(productId));
				productElement.click(clickId.add);
				navigateToPage('cart');
				getElement(containerId.main).click(clickId.submit);
				navigateToPage('orders');
				ordersElement.checkChildCount('list-item', orders.length + 1);
			});

			// it('New order is not created if backend respond is not OK', () => {
			//   const { id: productId, name, price } = products[0];
			//   navigateToPage('products');
			//   const productElement = getElement(`product-${productId}-component`);
			//   productElement.click('add-cart-button');
			//   navigateToPage('cart');
			//   const cartElement = getElement('cart-component');
			//   // TODO: Fix this test
			//   const errorMessage = 'One or more order items are invalid';

			//   // Stop the backend from responding with OK
			//   // cy.window().then(window => {
			//   //   const { rest, worker } = window.msw;
			//   //   worker.use(() => {
			//   //     rest.get('**/api/orders', (req, res, ctx) => {
			//   //       // Network failure with errorMessage
			//   //       return res(ctx.networkError(errorMessage));
			//   //     });
			//   //   });
			//   // });
			//   cy.intercept('POST', '**/api/orders', {
			//     statusCode: 500,
			//     body: {
			//       message: errorMessage
			//     }
			//   }).as('createOrderFailure');
			//   // cy.debug();
			//   // Fix this test
			//   cartElement.click('order-button');
			//   // Expect createOrderFailure to be called
			//   cy.wait('@createOrderFailure');
			//   expectNotification(errorMessage);
			//   // postOrderFailure.sendResponse();
			//   // cy.wait('@createOrderFailure');

			//   navigateToPage('orders');
			//   ordersElement.checkChildCount('order', orders.length);
			// });
		});
	});
});
