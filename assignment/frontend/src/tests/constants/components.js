/** @format */

export const dataTestIds = {
	clickId: {
		logout: 'logout', // For the element that logs out
		modify: 'modify', // For accessing the modify containers/routes
		submit: 'submit', // submit operations (login, register, modify, ...)
		delete: 'delete', // delete items (products, users, ...)
		cancel: 'cancel', // cancel operations (modify operations)
		reduce: 'reduce', // reduce the amount of an item (cart)
		add: 'add', // add the amount of an item (cart), add a new item (products)
	},
	linkId: {
		home: 'home-link', // For the element that links to the home page
		products: 'products-link', // For the element that links to the products page
		orders: 'orders-link', // For the element that links to the orders page
		users: 'users-link', // For the element that links to the users page
		register: 'register-link', // For the element that links to the register page
		login: 'login-link', // For the element that links to the login page
		inspect: 'inspect-link', // For the element that links to the inspect pages (products, orders, users)
		cart: 'cart-link', // For the element that links to the cart page
	},
	valueId: {
		description: 'description-value', // For the element that displays the description
		name: 'name-value', // For the element that displays the name
		price: 'price-value', // For the element that displays the price
		email: 'email-value', // For the element that displays the email
		role: 'role-value', // For the element that displays the role
		id: 'id-value', // For the element that displays the id
		quantity: 'quantity-value', // For the element that displays the quantity of an item
	},
	selectId: {
		role: 'role-select', // For the element that selects the role
	},
	inputId: {
		name: 'name-input', // For the element that inputs the name
		email: 'email-input', // For the element that inputs the email
		password: 'password-input', // For the element that inputs the password
		passwordConfirmation: 'passwordConfirmation-input', // For the element that inputs the password confirmation
		description: 'description-input', // For the element that inputs the description
		price: 'price-input', // For the element that inputs the price
	},
	containerId: {
		main: 'main-container', // For the element that contains the main content of the page
		listItem: (itemId) => `list-item-${itemId}-container`, // For the element that contains the list item
		profile: 'profile-container', // For the element that contains the profile
		navbar: 'navbar-container', // For the element that contains the navbar
		notification: 'notification-container', // For the element that contains the notification
		app: 'app-container', // For the element that contains the app
		empty: 'empty-container', // For the element that contains the empty page
		inspect: 'inspect-container', // For the element that contains the inspect page
		form: 'form-container', // For the element that contains the form
	},
};
