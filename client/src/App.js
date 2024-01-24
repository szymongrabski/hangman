import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from "./pages/Home";
import MainPage from "./pages/MainPage";
import { AuthProvider } from "./contexts/AuthContext";
import { WordsProvider } from "./contexts/WordsContext";
import AdminPanel from "./pages/AdminPanel";
import "./styles/style.css"
function App() {


  return (
    <AuthProvider>
      <WordsProvider>
        <BrowserRouter>
          <Routes>
            <Route path={"/"} element={<Home/>}/>
            <Route path={"/mainpage"} element={<MainPage/>}/>
            <Route path={"/adminpanel"} element={<AdminPanel />}/>
          </Routes>
        </BrowserRouter>
      </WordsProvider>
    </AuthProvider>
  )
}

export default App;
