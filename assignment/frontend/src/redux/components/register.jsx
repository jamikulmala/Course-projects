import { useState } from "react";
import { register } from "../actionCreators/authActions";
import { useDispatch } from "react-redux";

export const Register = () => {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [email, setEmail] = useState('');

    const dispatch = useDispatch();

    const submit = (e) => {
        e.preventDefault();
        const creds = {
            name : username,
            email : email,
            password : password,
            passwordConfirmation : confirmation
        }
        dispatch(register(creds));
        setUsername('');
        setPassword('');
        setEmail('');
        setConfirmation('');
    };

    return (
        <form onSubmit={submit} data-testid="form-container">
        <label htmlFor="username">Name: </label>
  		<input
    	type="text" 
    	name="username" 
    	id="username" 
        data-testid="name-input"
    	value={username}
        placeholder="enter a username"
        onChange={({ target }) => setUsername(target.value)} />
        <label htmlFor="username">Email: </label>
  		<input
    	type="text" 
    	name="email" 
    	id="email" 
        data-testid="email-input"
    	value={email}
        placeholder="enter an Email"
        onChange={({ target }) => setEmail(target.value)} />
	    <label htmlFor="password">Password: </label>
  		<input
    	type="password"
    	name="password"
    	id="password"
        data-testid="password-input"
    	value={password}
        placeholder="enter a password"
        onChange={({ target }) => setPassword(target.value)} />
        <label htmlFor="confirm">Confirm password: </label>
  		<input
    	type="password" 
    	name="confirm" 
    	id="confirm" 
        data-testid="passwordConfirmation-input"
    	value={confirmation}
        placeholder="Confirm the password"
        onChange={({ target }) => setConfirmation(target.value)} />
        <input type="submit" data-testid="submit" />
        </form>
    );
};