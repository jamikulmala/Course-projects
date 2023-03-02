import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, removeUser } from "../actionCreators/usersActions";
import { Link, useNavigate } from "react-router-dom";


export const Users = () => {
    
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);
    const users = useSelector((state) => state.users);
    const navigate = useNavigate();

    const deleteUser = (userId) => {
        dispatch(removeUser(userId));
    };

    const modifyUser = (u) => {
        navigate(`/users/${u.id}/modify`, {state: {u}});
    };

    if(user.role === 'admin'){
        return (
            <div>
		        {users.map((p) => {
                    if(p.email === user.email){
                        return (
			            <div key={p.email} data-testid={`list-item-${p.id}-container`}>
			        	    <span data-testid="name-value"> {p.name} </span>
                            <span data-testid="role-value"> {p.role} </span>
                            <Link to={{pathname: `/users/${p.id}`}} state= {{data: p}} data-testid="inspect-link">Inspect</Link>	
			            </div>  
                        );
                    }
                    else {
                        return (
			            <div key={p.email} data-testid={`list-item-${p.id}-container`}>
			        	    <span data-testid="name-value"> {p.name} </span>
                            <span data-testid="role-value">{p.role}</span>
                            <Link to={{pathname: `/users/${p.id}`}} state= {{data: p}} data-testid="inspect-link">Inspect</Link>
                            <button data-testid="modify" onClick={() => modifyUser(p)}>Modify</button>
                            <button data-testid="delete" onClick={() => deleteUser(p.id)}>Delete</button>
			            </div>  
                        );
                    }}
                )}
            </div>
        );
    }
};