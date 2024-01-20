import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from "./pages/Home";
import MainPage from "./pages/MainPage";
import { AuthProvider } from "./components/contexts/AuthContext";
import { WordsProvider } from "./components/contexts/WordsContext";
function App() {


  return (
    <AuthProvider>
      <WordsProvider>
        <BrowserRouter>
          <Routes>
            <Route path={"/"} element={<Home/>}/>
            <Route path={"/mainpage"} element={<MainPage/>}/>
          </Routes>
        </BrowserRouter>
      </WordsProvider>
    </AuthProvider>
  )
}

export default App;
