import { useContext } from "react"
import LogOutButton from "../components/general/LogOutButton"
import Game from "../components/mainPage/Game"
import UpdateUserForm from "../components/mainPage/UpdateUserForm"
import { AuthContext } from "../components/contexts/AuthContext"

const MainPage = () => {
    const { loggedIn } = useContext(AuthContext);

    if (loggedIn) {
        return (
            <div>
                <UpdateUserForm />
                <Game />
                <LogOutButton />
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