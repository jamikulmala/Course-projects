import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ADD_CART_ITEM } from "../../tests/constants/redux";
import { addCartItem } from "../actionCreators/cartActions";

export const Products = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const products = useSelector((state) => state.products);
	const user = useSelector((state) => state.auth);

    let addOpen = false;

    const productAdd = (e) => {
        e.preventDefault();
        addOpen = !addOpen;
        if(user.role === 'admin') {
            if(addOpen) {
                navigate('/productCreator');
            }
            else {
                navigate('/');
            }
        }
    };

    const addToCart = (item) => {
        dispatch(addCartItem(item));
    };

        return (
            <div>
                {products.map((p) => {
                return (
                    <div key={p.name} data-testid={`list-item-${p.id}-container`}>
                        <span data-testid="name-value"> {p.name} </span>
                        <span data-testid="price-value"> {p.price} </span>
                        <Link data-testid="inspect-link"> Inspect </Link>
                        <button data-testid="add" onClick={() => addToCart(p)}>Add to cart</button>
                    </div>  
                )})}
                <button onClick={productAdd}>Add new item</button>
            </div>
        );

};