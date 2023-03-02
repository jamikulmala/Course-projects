import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { updateUser } from "../actionCreators/usersActions";

export const ModifyUser = () => {
    const state = useLocation();
    const data = state.state.u;
    const [currentRole, changeRole] = useState(data.role);
    const [currentUser, modifyUser] = useState(data);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submit = (e) => {
        e.preventDefault();
        dispatch(updateUser(currentUser));
        navigate(-1, {replace:true});
    };

    const cancelForm = (e) => {
        e.preventDefault();
        navigate(`/users/${currentUser.id}`, {replace:true});
    };

    const handleClick = (e) => {
        e.preventDefault();
        if(currentRole === 'guest' || currentRole === 'customer') {
            changeRole('admin');
            modifyUser({...currentUser, role: 'admin'});
        }
        else if(currentRole === 'guest' || currentRole === 'admin') {
            changeRole('customer');
            modifyUser({...currentUser, role: 'customer'});
        }
    };

    return (
        <form onSubmit={submit} data-testid="form-container">
  		<span data-testid="name-value">{data.name}</span>
        <select data-testid="role-select" value={currentRole} onChange={handleClick}>
            <option value='customer'>customer</option>
            <option value='admin'>admin</option>
        </select>
        <input type="submit" data-testid="submit" disabled={data.role === currentRole ? true : false}/>
        <button type="submit" data-testid="cancel" onClick={cancelForm}>Cancel</button>
        </form>
    );
    
};