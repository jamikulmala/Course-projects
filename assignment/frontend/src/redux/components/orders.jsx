import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getOrders } from "../actionCreators/ordersActions";

export const Orders = () => {
    
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);
    const orders = useSelector((state) => state.orders);

    if(orders.length > 0) {
        return (
            <div>
                {orders.map((p) => {
                if(p.customerId === user.id || user.role === 'admin') {
                    return (
                        <div key={p.id} data-testid={`list-item-${p.id}-container`}>
                            <span data-testid="id-value"> {p.id} </span>
                            <Link to={{pathname: `/orders/${p.id}`}} state={{data: p}} data-testid="inspect-link">Inspect</Link>
                        </div>  
                )}})}
            </div>
        );
    }
    else {
        return (
            <div data-testid="empty-container">No Orders</div>
        );
    }
};