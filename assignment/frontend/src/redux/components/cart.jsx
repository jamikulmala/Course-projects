import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { decrementCartItem, emptyCart, incrementCartItem, removeCartItem } from "../actionCreators/cartActions";
import { addOrder } from "../actionCreators/ordersActions";

export const Cart = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth);
    const cart = useSelector((state) => state.cart);
    const products = useSelector((state) => state.products);
    const items = {...localStorage};

    if(user.role === 'customer' || user.role === 'guest') {

        const add = (item) => {
            dispatch(incrementCartItem(item));
        };

        const decrease = (item) => {
            if(item.quantity > 1){
                dispatch(decrementCartItem(item.product.id));
            } else {
                dispatch(removeCartItem(item.product));
            }
        };

        const placeOrder = (e) => {
            e.preventDefault();
            if(user.role === 'guest') {
                navigate('/login',{ replace:true });
            }
            else {
                const order = {
                    items: cart
                };
                dispatch(addOrder(order));
            }
        };

        if(cart.length === 0) {
            return (
                <div data-testid="empty-container">Empty Cart</div>
            );
        }
        else {
            return (
                <div>
                {cart.map(key => {
                if(key.quantity > 0) {
                    return (
                    <div key={key.product.id} data-testid={`list-item-${key.product.id}-container`}>
                        <button data-testid="reduce" onClick={() => decrease(key)}>-</button>
                        <button data-testid="add" onClick={() => add(key.product.id)}>+</button>
                        <span data-testid="name-value"> {key.product.name} </span>
                        <span data-testid="price-value"> {key.product.price} </span>
                        <span data-testid="quantity-value"> {key.quantity} </span>
                    </div>  
            
                )}})}
                <button data-testid="submit" onClick={placeOrder}>Place an Order</button>
            </div>
            );
        }

    }
};