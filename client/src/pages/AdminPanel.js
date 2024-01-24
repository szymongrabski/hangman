import { useCookies } from "react-cookie";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import LogOutButton from "../components/general/LogOutButton";
import { AuthContext } from "../contexts/AuthContext"
import WordsPanel from "../components/adminPanel/words/WordsPanel";
import UsersPanel from "../components/adminPanel/users/UsersPanel";
import SelfPanel from "../components/adminPanel/admin/SelfPanel";

const AdminPanel = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [cookies] = useCookies(["user"]);
    const { loggedIn } = useContext(AuthContext);

    const verify = async () => {
        try {
            if (!cookies.AuthToken) {
                setIsAdmin(false);
                return;
            }

            const response = await axios.get("http://localhost:5000/admins/admin/verification", {
                headers: {
                    Authorization: cookies.AuthToken
                }
            });

            if (response.status === 200) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        } catch (error) {
            console.error('Error verifying admin status:', error.message);
            setIsAdmin(false);
        }
    };

    useEffect(() => {
        verify();
    }, [cookies.AuthToken]);

    if (loggedIn) {
        return (
            <div>
                {isAdmin ? (
                    <div>
                        <SelfPanel />
                        <WordsPanel />
                        <UsersPanel />
                        <LogOutButton />
                    </div>
                ) : (
                    <p>Nie masz uprawnień administratora</p>
                )}
            </div>
        );
    } else {
        return (
            <p>
                Nie jesteś zalogowany
            </p>
        )
    }
};

export default AdminPanel;