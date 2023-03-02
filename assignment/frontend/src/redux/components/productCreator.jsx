import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { addProduct } from "../actionCreators/productsActions";

export const ProductCreator = () => {

    const navigate = useNavigate();
    const user = useSelector((state) => state.auth);
    if(user.role === 'admin') {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [desc, setDesc] = useState('');

    const dispatch = useDispatch();

    const submit = (e) => {
        e.preventDefault();
        const creds = {
            name : name,
            price : price,
            description : desc
        };
        dispatch(addProduct(creds));
        
        setName('');
        setPrice('');
        setDesc('');
        navigate('/products');
    };

    const cancel = (e) => {
        e.preventDefault();
        setName('');
        setPrice('');
        setDesc('');
        navigate('/products');
    };

    return (
        <form onSubmit={submit} data-testid="form-container">
        <label htmlFor="name">Name: </label>
  		<input
    	type="text" 
    	name="name" 
    	id="name" 
        data-testid="name-input"
    	value={name}
        placeholder="name"
        onChange={({ target }) => setName(target.value)} />
        <label htmlFor="price">Price: </label>
  		<input
    	type="text" 
    	name="price" 
    	id="price" 
        data-testid="price-input"
    	value={price}
        placeholder="price"
        onChange={({ target }) => setPrice(target.value)} />
        <label htmlFor="desc">Set description: </label>
  		<input
    	type="text" 
    	name="desc" 
    	id="desc" 
        data-testid="description-input"
    	value={desc}
        placeholder="description"
        onChange={({ target }) => setDesc(target.value)} />
        <input type="submit" data-testid="submit" />
        <button data-testid="cancel" onClick={cancel}> cancel </button>
        </form>
    );
    }
};