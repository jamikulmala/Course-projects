import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logOut } from '../actionCreators/authActions';

export const NavBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth);

    const handleLogOut = (e) => {
        e.preventDefault();
        dispatch(logOut());
        navigate('/login',{ replace:true });
    };

    if(user.role === "customer"){
        return(
            <div data-testid="navbar-container">
                <Link to={`/`} data-testid="home-link">Home </Link>
                <Link to={`/products`} data-testid="products-link">Products </Link>
                <Link to={`/orders`} data-testid="orders-link">Orders </Link>
                <Link to={`/cart`} data-testid="cart-link">Cart </Link>
                <Link to={`/login`} data-testid="login-link">Login </Link>
                <Link to={`/register`} data-testid="register-link">Register </Link>
                <button data-testid="logout" onClick={handleLogOut}>Logout </button>
                <span data-testid="profile-container">
                    <span data-testid="role-value">Role: {user.role}</span>
                </span>
            </div>
        );
    }
    else if(user.role === "admin"){
        return(
            <div data-testid="navbar-container">
                <Link to={`/`} data-testid="home-link">Home </Link>
                <Link to={`/products`} data-testid="products-link">Products </Link>
                <Link to={`/orders`} data-testid="orders-link">Orders </Link>
                <Link to={`/users`} data-testid="users-link">Users </Link>
                <button data-testid="logout" onClick={handleLogOut}>Logout </button>
                <span data-testid="profile-container">
                    <span data-testid="role-value">Role: {user.role}</span>
                </span>
            </div>
        );
    }
    else{
        return(
            <div data-testid="navbar-container">
                <Link to={`/`} data-testid="home-link">Home </Link>
                <Link to={`/products`} data-testid="products-link">Products </Link>
                <Link to={`/cart`} data-testid="cart-link">Cart </Link>
                <Link to={`/login`} data-testid="login-link">Login </Link>
                <Link to={`/register`} data-testid="register-link">Register </Link>
                <span data-testid="profile-container">
                    <span data-testid="role-value">Role: {user.role}</span>
                </span>
            </div>
        );
    }
};