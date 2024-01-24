import React, { useContext } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../contexts/AuthContext";

const LogOutButton = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogOut = () => {
        console.log("Wylogowano")
        removeCookie('AuthToken', { path: '/', expires: new Date(0) }); 
        removeCookie('Username', { path: '/', expires: new Date(0) });
        removeCookie('UserId', { path: '/', expires: new Date(0) });
        logout();
        navigate('/');
    }

    return (
        <div>
            <button className="log-out-btn" onClick={handleLogOut}>Wyloguj się</button>
        </div>
    )
};

export default LogOutButton;
