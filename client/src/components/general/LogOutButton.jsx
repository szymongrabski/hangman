import React, { useContext } from "react";
import { useCookies } from 'react-cookie';
import { AuthContext } from "../../contexts/AuthContext";

const LogOutButton = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const { logout } = useContext(AuthContext)

    const handleLogOut = () => {
        console.log("Wylogowano")
        removeCookie('AuthToken', { path: '/', expires: new Date(0) }); 
        removeCookie('Username', { path: '/', expires: new Date(0) });
        removeCookie('UserId', { path: '/', expires: new Date(0) });
        logout()
    }

    return (
        <div>
            <button onClick={handleLogOut}>Wyloguj się</button>
        </div>
    )
};

export default LogOutButton;
