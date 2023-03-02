/** @format */
import React from 'react';
import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import { dataTestIds } from './tests/constants/components.js';
import { HomePage } from './redux/components/homePage.jsx';
import { NavBar } from './redux/components/navBar.jsx';
import { initApp } from './redux/actionCreators/appActions.js';
import { useDispatch, useSelector } from 'react-redux';
import { Register } from './redux/components/register.jsx';
import { Login } from './redux/components/login.jsx';
import { Cart } from './redux/components/cart.jsx';
import { Orders } from './redux/components/orders.jsx';
import { Products } from './redux/components/products.jsx';
import { Users } from './redux/components/users.jsx';
import { NotificationContainer } from './redux/components/notification.jsx';
import { ProductCreator } from './redux/components/productCreator.jsx';
import { UserInfo } from './redux/components/userInfo.jsx';
import { ModifyUser } from './redux/components/userModify.jsx';
import { InspectOrder } from './redux/components/inspectOrder.jsx';
import { getOrders } from './redux/actionCreators/ordersActions.js';
import { getUsers } from './redux/actionCreators/usersActions.js';

const App = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth);
	const orders = useSelector((state) => state.orders);
	const users = useSelector((state) => state.users);

	if(user.role === 'guest'){
		localStorage.clear();
	}
    useEffect(() => {
        dispatch(initApp());
    }, [dispatch]);
	useEffect(() => {
		if(orders.length === 0){
            if(user.role === 'customer' || user.role === 'admin') {
                dispatch(getOrders());
            }
        }
		if(users.length === 0){
			if(user.role === 'admin'){
				dispatch(getUsers());
			}
		}	
	}, [user]);


	return (
		<Router>
		<div data-testid={dataTestIds.app}>
			<NavBar />
			<NotificationContainer />
				<div data-testid="main-container">
				<Routes>
					<Route exact path="/" element={<HomePage />}/>
					<Route exact path="/register" element={<Register />}/>
					<Route exact path="/login" element={<Login />}/>
					<Route exact path="/cart" element={<Cart />}/>
					<Route exact path="/orders" element={<Orders/>}/>
					<Route exact path="/products" element={<Products />}/>
					<Route exact path="/users" element={<Users />}/>
					<Route exact path="/productCreator" element={<ProductCreator />}/>
					<Route path="/users/:id" element={<UserInfo />}/>
					<Route path="/users/:id/modify" element={<ModifyUser />}/>
					<Route path="/orders/:id" element={<InspectOrder />}/>
				</Routes>
				</div>
			</div>
		</Router>
	);
};

export default App;
