import { useState } from "react";
import { logIn } from "../actionCreators/authActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../actionCreators/ordersActions";

export const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submit = (e) => {
        e.preventDefault();
        const creds = {
            email : username,
            password : password
        };
        dispatch(logIn(creds));
        setUsername('');
        setPassword('');
    };

    return (
        <form onSubmit={submit} data-testid="form-container">
        <label htmlFor="username">Email: </label>
  		<input
    	type="text" 
    	name="username" 
    	id="username" 
        data-testid="email-input"
    	value={username}
        placeholder="enter a username"
        onChange={({ target }) => setUsername(target.value)} />
	    <label htmlFor="password">Password: </label>
  		<input
    	type="password"
    	name="password"
    	id="password"
        data-testid="password-input"
    	value={password}
        placeholder="enter a password"
        onChange={({ target }) => setPassword(target.value)} />
        <input type="submit" data-testid="submit" />
        </form>
    );
};