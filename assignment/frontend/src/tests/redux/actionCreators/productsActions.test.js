/** @format */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { beforeEach, describe, expect, it } from 'vitest';
import {
	addProduct,
	deleteProduct,
	getProduct,
	getProducts,
	updateProduct,
} from '../../../redux/actionCreators/productsActions';
import {
	ADD_PRODUCT,
	DELETE_PRODUCT,
	GET_PRODUCT,
	GET_PRODUCTS,
	NEW_NOTIFICATION,
	UPDATE_PRODUCT,
} from '../../constants/redux.js';
import { productsApi } from '../../mocks/handlers.js';

import { server, rest } from '../../mocks/server';

import { db } from '../../utils/testDb';

const product = db.products[0];

// const mock = new MockAdapter(axios);

let store;
beforeEach(() => {
	store = mockStore({});
	// mock.resetHandlers();
});

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const testErrorMsg = 'Expected error message.';

describe('Testing thunk action creators', () => {
	describe('getProduct:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: product-object is returned', async () => {
				server.use(
					rest.get(`${productsApi}/${product.id}`, (req, res, ctx) => {
						return res(ctx.status(200), ctx.json(product));
					})
				);
				const expectedActions = [
					{
						type: GET_PRODUCT,
						payload: product,
					},
				];
				return store.dispatch(getProduct(product.id)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
		describe('expected actions should be dispatched on unsuccessful requests', () => {
			it('Case 1: Error caught -> NEW_NOTIFICATION', async () => {
				server.use(
					rest.get(`${productsApi}/${product.id}`, (req, res, ctx) => {
						return res(
							ctx.status(400),
							ctx.json({
								error: testErrorMsg,
							})
						);
					})
				);
				const store = mockStore({});
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: testErrorMsg, isSuccess: false },
					},
				];
				return store.dispatch(getProduct(product.id)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
	});
	describe('getProducts:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: products-array is returned', async () => {
				server.use(
					rest.get(productsApi, (req, res, ctx) => {
						return res(ctx.status(200), ctx.json(db.products));
					})
				);
				const expectedActions = [
					{
						type: GET_PRODUCTS,
						payload: db.products,
					},
				];
				return store.dispatch(getProducts()).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
		describe('expected actions should be dispatched on unsuccessful requests', () => {
			it('Case 1: Error caught -> NEW_NOTIFICATION', async () => {
				server.use(
					rest.get(productsApi, (req, res, ctx) => {
						return res(
							ctx.status(400),
							ctx.json({
								error: testErrorMsg,
							})
						);
					})
				);

				const store = mockStore({});
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: testErrorMsg, isSuccess: false },
					},
				];
				return store.dispatch(getProducts()).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
	});
	describe('updateProduct:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: products-array is returned', async () => {
				server.use(
					rest.put(`${productsApi}/${product.id}`, (req, res, ctx) => {
						return res(ctx.status(200), ctx.json(product));
					})
				);
				const expectedActions = [
					{
						type: UPDATE_PRODUCT,
						payload: product,
					},
					{
						type: NEW_NOTIFICATION,
						payload: { message: 'Product updated.', isSuccess: true },
					},
				];
				return store.dispatch(updateProduct(product)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
		describe('expected actions should be dispatched on unsuccessful requests', () => {
			it('Case 1: Error caught -> NEW_NOTIFICATION', async () => {
				server.use(
					rest.put(`${productsApi}/${product.id}`, (req, res, ctx) => {
						return res(
							ctx.status(400),
							ctx.json({
								error: testErrorMsg,
							})
						);
					})
				);
				const store = mockStore({});
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: testErrorMsg, isSuccess: false },
					},
				];
				return store.dispatch(updateProduct(product)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
	});
	describe('deleteProduct:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: updated product from the backend is returned', async () => {
				server.use(
					rest.delete(`${productsApi}/${product.id}`, (req, res, ctx) => {
						return res(ctx.status(200), ctx.json(product));
					})
				);
				const expectedActions = [
					{
						type: DELETE_PRODUCT,
						payload: product,
					},
					{
						type: NEW_NOTIFICATION,
						payload: {
							message: `${product.name} deleted successfully`,
							isSuccess: true,
						},
					},
				];
				return store.dispatch(deleteProduct(product.id)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
		describe('expected actions should be dispatched on unsuccessful requests', () => {
			it('Case 1: Error caught -> NEW_NOTIFICATION', async () => {
				server.use(
					rest.delete(`${productsApi}/${product.id}`, (req, res, ctx) => {
						return res(
							ctx.status(400),
							ctx.json({
								error: testErrorMsg,
							})
						);
					})
				);
				const store = mockStore({});
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: testErrorMsg, isSuccess: false },
					},
				];
				return store.dispatch(deleteProduct(product.id)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
	});
	describe('addProduct:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: updated product from the backend is returned', async () => {
				server.use(
					rest.post(productsApi, (req, res, ctx) => {
						return res(ctx.status(201), ctx.json(product));
					})
				);
				const expectedActions = [
					{
						type: ADD_PRODUCT,
						payload: product,
					},
					{
						type: NEW_NOTIFICATION,
						payload: { message: 'Product added.', isSuccess: true },
					},
				];
				return store.dispatch(addProduct(product)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
		describe('expected actions should be dispatched on unsuccessful requests', () => {
			it('Case 1: Error caught -> NEW_NOTIFICATION', async () => {
				server.use(
					rest.post(productsApi, (req, res, ctx) => {
						return res(
							ctx.status(400),
							ctx.json({
								error: testErrorMsg,
							})
						);
					})
				);
				const store = mockStore({});
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: testErrorMsg, isSuccess: false },
					},
				];
				return store.dispatch(addProduct(product)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
			it('Case 1: Error-object with image caught -> NEW_NOTIFICATION', async () => {
				server.use(
					rest.post(productsApi, (req, res, ctx) => {
						return res(
							ctx.status(400),
							ctx.json({
								error: { image: 'Needs to be a url!' },
							})
						);
					})
				);
				const store = mockStore({});
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: 'Needs to be a url!', isSuccess: false },
					},
				];
				return store.dispatch(addProduct(product)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
	});
});
