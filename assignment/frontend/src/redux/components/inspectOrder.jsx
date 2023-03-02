import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getOrder } from "../actionCreators/ordersActions";

export const InspectOrder = () => {

    const [data, setData] = useState({});
    const [isLoading, setLoading] = useState(true);

    async function fetchOrder (orderId) {
        try{
            const response = await axios({ 
            method: 'GET',
            url: `http://localhost:3001/api/orders/${orderId}`,
            data: JSON.stringify(orderId),
            headers: {
                Accept: 'application/json'
            },
            withCredentials : true
            });
            const data = await response.data;
            setData(data);
            setLoading(false);
        }
        catch(error){
            console.log(error);
        }
    }

    const user = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const state = useLocation();
    if((user.role === 'admin' || user.role === 'customer') && (state.state !== null)){
        const data = state.state.data;
        return (
            <div data-testid="inspect-container">
                {data.items.map(item => {
                    return (
                        <div key={item.product.id} data-testid={`list-item-${item.product.id}-container`}>
                            <span data-testid="name-value"> {item.product.name} </span>
                            <span data-testid="quantity-value"> {item.quantity} </span>
                        </div>
                    );
                })}
            </div>
        );
    } else {
        const path = state.pathname.split('/orders/')[1];
        
        useEffect(() => {
            fetchOrder(path);
        }, []);
        
        if(isLoading) {
            return <div>Loading...</div>;
        }
        return (
            <div data-testid="inspect-container">
                {data.items.map(item => {
                    return (
                        <div key={item.product.id} data-testid={`list-item-${item.product.id}-container`}>
                            <span data-testid="name-value"> {item.product.name} </span>
                            <span data-testid="quantity-value"> {item.quantity} </span>
                        </div>
                    );
                })}
            </div>
        );
    }
};