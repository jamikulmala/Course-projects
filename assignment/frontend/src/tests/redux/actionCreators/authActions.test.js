/** @format */

import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
	initAuth,
	logIn,
	logOut,
	register,
} from '../../../redux/actionCreators/authActions';
import {
	CLEAR_ORDERS,
	CLEAR_USERS,
	INIT_AUTH,
	NEW_NOTIFICATION,
	REMOVE_AUTH,
	authMsg,
	invalidAuthMsg,
} from '../../constants/redux.js';

import { db } from '../../utils/testDb';
import { server } from '../../mocks/server';
import { rest } from '../../mocks/server';
import {
	checkStatusApi,
	loginApi,
	logOutApi,
	registerApi,
} from '../../mocks/handlers.js';
const existingUser = db.users[0];

const user = {
	name: 'test name',
	email: 'test@email.com',
	password: 'testPassword',
	passwordConfirmation: 'testPassword',
};

let store;
beforeEach(() => {
	store = mockStore({});
});

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Testing thunk action creators', () => {
	describe('initAuth:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: existing user is returned', async () => {
				server.use(
					rest.get(checkStatusApi, (req, res, ctx) => {
						return res(
							ctx.status(200),
							ctx.json({
								user: existingUser,
							})
						);
					})
				);
				const expectedActions = [
					{
						type: INIT_AUTH,
						payload: existingUser,
					},
				];
				return store.dispatch(initAuth()).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
			it('Case 2: user-object is not returned', async () => {
				server.use(
					rest.get(checkStatusApi, (req, res, ctx) => {
						return res(ctx.status(200), ctx.json({}));
					})
				);
				const store = mockStore({});
				const expectedActions = [
					{
						type: INIT_AUTH,
					},
				];
				return store.dispatch(initAuth()).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
		describe('expected actions should be dispatched on unsuccessful requests', () => {
			it('Case 1: Error caught -> NEW_NOTIFICATION', async () => {
				server.use(
					rest.get(checkStatusApi, (req, res, ctx) => {
						return res(ctx.status(400), ctx.json({ error: 'test-error' }));
					})
				);
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: 'test-error', isSuccess: false },
					},
				];
				return store.dispatch(initAuth()).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
	});
	describe('logIn:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: user-object is returned', async () => {
				const logInCreds = {
					email: existingUser.email,
					password: 'correctpassword',
				};

				server.use(
					rest.post(loginApi, (req, res, ctx) => {
						return res(
							ctx.status(200),
							ctx.json({
								user: existingUser,
							})
						);
					})
				);
				const expectedActions = [
					{
						type: INIT_AUTH,
						payload: existingUser,
					},
					{
						type: NEW_NOTIFICATION,
						payload: { message: authMsg.welcomeBack, isSuccess: true },
					},
				];
				return store.dispatch(logIn(logInCreds)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
		describe('expected actions should be dispatched on unsuccessful attempts', () => {
			it('Case 1: Backend Error response caught -> NEW_NOTIFICATION', async () => {
				const logInCreds = {
					email: existingUser.email,
					password: 'correctpassword',
				};
				server.use(
					rest.post(loginApi, (req, res, ctx) => {
						return res(
							ctx.status(400),
							ctx.json({
								error: 'test-error',
							})
						);
					})
				);
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: 'test-error', isSuccess: false },
					},
				];
				return store.dispatch(logIn(logInCreds)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
			it(`Case 2: ${invalidAuthMsg.email} -> NEW_NOTIFICATION`, async () => {
				const logInCreds = {
					email: 'invalid',
					password: 'correctpassword',
				};
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: invalidAuthMsg.email, isSuccess: false },
					},
				];
				return store.dispatch(logIn(logInCreds)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
			it(`Case 3: ${invalidAuthMsg.password} -> NEW_NOTIFICATION`, async () => {
				const logInCreds = {
					email: existingUser.email,
					password: 'bug',
				};
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: invalidAuthMsg.password, isSuccess: false },
					},
				];
				return store.dispatch(logIn(logInCreds)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
	});
	describe('logOut:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: Logged out -> REMOVE_AUTH, CLEAR_ORDERS, CLEAR_USERS, NEW_NOTIFICATION', async () => {
				server.use(
					rest.get(logOutApi, (req, res, ctx) => {
						return res(ctx.status(200), ctx.json({ message: 'Logged out.' }));
					})
				);
				const expectedActions = [
					{
						type: REMOVE_AUTH,
					},
					{
						type: CLEAR_ORDERS,
					},
					{
						type: CLEAR_USERS,
					},
					{
						type: NEW_NOTIFICATION,
						payload: { message: 'Logged out.', isSuccess: true },
					},
				];
				return store.dispatch(logOut()).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
	});
	describe('register:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: user-object is returned', async () => {
				server.use(
					rest.post(registerApi, (req, res, ctx) => {
						return res(ctx.status(201), ctx.json({ user }));
					})
				);
				const expectedActions = [
					{
						type: INIT_AUTH,
						payload: user,
					},
					{
						type: NEW_NOTIFICATION,
						payload: { message: authMsg.welcome(user.name), isSuccess: true },
					},
				];
				return store.dispatch(register(user)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
		describe('expected actions should be dispatched on unsuccessful attempts', () => {
			it('Case 1: Backend Response Error caught -> NEW_NOTIFICATION (Hint: error is object)', async () => {
				server.use(
					rest.post(registerApi, (req, res, ctx) => {
						return res(
							ctx.status(400),
							ctx.json({ error: { email: 'test-error' } })
						);
					})
				);
				const store = mockStore({});
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: 'test-error', isSuccess: false },
					},
				];
				return store.dispatch(register(user)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
			it(`Case 2: ${invalidAuthMsg.email} -> NEW_NOTIFICATION`, async () => {
				const registerInCreds = {
					email: 'invalid',
					password: 'correctpassword',
				};
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: invalidAuthMsg.email, isSuccess: false },
					},
				];
				return store.dispatch(register(registerInCreds)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
			it(`Case 3: ${invalidAuthMsg.password} -> NEW_NOTIFICATION`, async () => {
				const registerInCreds = {
					email: user.email,
					password: 'bug',
				};
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: invalidAuthMsg.password, isSuccess: false },
					},
				];
				return store.dispatch(register(registerInCreds)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
			it(`Case 4: ${invalidAuthMsg.name} -> NEW_NOTIFICATION`, async () => {
				const registerInCreds = {
					name: 'fo', // too short: min 3 chars
					email: user.email,
					password: 'correctpassword',
				};
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: invalidAuthMsg.name, isSuccess: false },
					},
				];
				return store.dispatch(register(registerInCreds)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
			it(`Case 5: ${invalidAuthMsg.passwordConfirmationa} -> NEW_NOTIFICATION`, async () => {
				const registerInCreds = {
					name: user.name,
					email: user.email,
					password: 'correctpassword',
					passwordConfirmation: 'notthesame',
				};
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: {
							message: invalidAuthMsg.passwordConfirmation,
							isSuccess: false,
						},
					},
				];
				return store.dispatch(register(registerInCreds)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
	});
});
