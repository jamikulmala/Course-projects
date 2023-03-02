import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { removeUser } from "../actionCreators/usersActions";

export const UserInfo = () => {

    const [data, setData] = useState({});
    const [isLoading, setLoading] = useState(true);

    async function fetchUser (userId) {
        try{
            const response = await axios({ 
            method: 'GET',
            url: `http://localhost:3001/api/users/${userId}`,
            data: JSON.stringify(userId),
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

    const state = useLocation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const deleteUser = (userId) => {
            dispatch(removeUser(userId));
            navigate(-1);
    };

    const modifyUser = (u) => {
        navigate(`/users/${u.id}/modify`, {state: {u}});
    };

        const path = state.pathname.split('/users/')[1];
        useEffect(() => {
            fetchUser(path);   
        }, []);    

        if(isLoading) {
            return <div>Loading...</div>;
        }

        if(user.role === 'admin' || user.role === 'customer'){

            if(user.id === data.id) {
                return (
                <div data-testid='inspect-container'>
                    <span data-testid="name-value"> {data.name} </span>
                    <span data-testid="role-value">{data.role}</span>
                    <span data-testid="email-value"> {data.email} </span>
                </div>
                );
            }
            else{
            return (
                <div data-testid='inspect-container'>
                    <span data-testid="name-value"> {data.name} </span>
                    <span data-testid="role-value">{data.role}</span>
                    <span data-testid="email-value"> {data.email} </span>
                    <button data-testid="modify" onClick={() => modifyUser(data)}>Modify</button>
                    <button data-testid="delete" onClick={() => deleteUser(data.id)}>Delete</button>
                </div>  
                );
            }
        }

};