import { useContext } from "react"
import HomePanel from "../components/home/HomePanel"
import { AuthContext } from "../contexts/AuthContext"
import LogOutButton from "../components/general/LogOutButton";

const Home = () => {
    const { loggedIn } = useContext(AuthContext);

    if (!loggedIn) {
        return (
            <div>
                <HomePanel />
            </div>
        )
    } else {
        return (
            <div>
                <p>Jesteś zalogowany</p>
                <LogOutButton/>
            </div>
        )
    }
}

export default Home