import React, { useState } from "react";
import { useCookies } from 'react-cookie';
import UserRegistrationForm from "./user/UserRegistrationForm";
import UserLoginForm from "./user/UserLoginForm";
import AdminLoginForm from "./admin/AdminLoginForm";
import AdminRegistrationForm from "./admin/AdminRegisterPanel";

const HomePanel = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [toggle, setToggle] = useState(false);
    const [toggleFunction, setToggleFunction] = useState(false);

    const handleToggle = () => {
        setToggle((prevValue) => !prevValue);
    };

    return (
        <div>
            <h2>{toggleFunction ? "Admin" : toggle ? "Logowanie" : "Rejestracja"}</h2>
            {toggleFunction ? (
                toggle ? <AdminLoginForm /> : <AdminRegistrationForm />
            ) : (
                toggle ? <UserLoginForm /> : <UserRegistrationForm />
            )}
            <button onClick={handleToggle}>
                {toggle ? "Zarejestruj się" : "Zaloguj się"}
            </button>
            <button onClick={() => setToggleFunction(prevValue => !prevValue)}>
                Zmień Funkcje
            </button>
        </div>
    );
};

export default HomePanel;
