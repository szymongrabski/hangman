import { useState, useContext } from "react"
import LogOutButton from "../components/general/LogOutButton"
import Game from "../components/mainPage/Game"
import UpdateUserForm from "../components/mainPage/UpdateUserForm"
import { AuthContext } from "../contexts/AuthContext"

const MainPage = () => {
    const { loggedIn } = useContext(AuthContext);
    const [showForm, setShowForm] = useState(false)

    if (loggedIn) {
        return (
            <div>
                <Game />
                <div className="buttons">
                    <button className="btn" onClick={() => setShowForm(prev => !prev)}> Aktualizuj konto </button>
                    <LogOutButton />
                </div>
                <UpdateUserForm showForm={showForm}/>
            </div>
        )
    } else {
        return (
            <p>
                Nie jesteś zalogowany
            </p>
        )
    }
}

export default MainPage