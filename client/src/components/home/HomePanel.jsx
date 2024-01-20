import React, { useState } from "react";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import { useCookies } from 'react-cookie';

const HomePanel = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [toggle, setToggle] = useState(false);

    const handleToggle = () => {
        setToggle((prevValue) => !prevValue);
    };



    return (
        <div>
            <h2>{toggle ? "Logowanie" : "Rejestracja"}</h2>
                {toggle ? <LoginForm /> : <RegistrationForm />}
            <button onClick={handleToggle}>
                {toggle ? "Zarejestruj się" : "Zaloguj się"}
            </button>
        </div>
    );
};

export default HomePanel;
