import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from "./pages/Home";
import MainPage from "./pages/MainPage";

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Home/>}/>
        <Route path={"/mainpage"} element={<MainPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
