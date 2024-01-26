import React, { useState } from "react";
import UserRegistrationForm from "./user/UserRegistrationForm";
import UserLoginForm from "./user/UserLoginForm";
import AdminLoginForm from "./admin/AdminLoginForm";
import AdminRegistrationForm from "./admin/AdminRegisterPanel";
import Ranking from "../general/Ranking";
import Advertisement from "../general/Advertisement";

const HomePanel = () => {
    const [toggle, setToggle] = useState(false);
    const [toggleFunction, setToggleFunction] = useState(false);

    const handleToggle = () => {
        setToggle((prevValue) => !prevValue);
    };

    return (
        <div>
            <div className="function-item">
                <h2>{toggleFunction ? "Admin" : "Użytkownik"}</h2>
                <div>
                    <button className="btn" onClick={() => setToggleFunction(prevValue => !prevValue)}>
                        Admin/Użytkownik
                    </button>
                </div>
            </div>
            <div className="main-item">
                <Advertisement />
                <div>
                    {toggleFunction ? (
                        toggle ? <AdminLoginForm /> : <AdminRegistrationForm />
                    ) : (
                        toggle ? <UserLoginForm /> : <UserRegistrationForm />
                    )}
                    {toggle ? (
                        <div className="info-item">
                            <p>Nie masz konta?</p>
                            <button className="btn" onClick={handleToggle}>Zarejestruj się</button>
                        </div>
                    ): (
                        <div className="info-item">
                            <p>Masz już konto?</p>
                            <button className="btn" onClick={handleToggle}>Zaloguj się</button>
                        </div>
                    )}
                </div>
                <Ranking />
            </div>
        </div>
    );
};

export default HomePanel;
