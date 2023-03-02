import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../actionCreators/ordersActions";
import { getProducts } from "../actionCreators/productsActions";
import { getUsers } from "../actionCreators/usersActions";

export const HomePage = () => {

    const user = useSelector((state) => state.auth);
    const users = useSelector((state) => state.users);
    const products = useSelector((state) => state.products);
    const orders = useSelector((state) => state.orders);
    const dispatch = useDispatch();

    useEffect(() => {
        if(products.length === 0){
            dispatch(getProducts());
        }
        
    });
    

    return (
        <div>Hey</div>
    );
};