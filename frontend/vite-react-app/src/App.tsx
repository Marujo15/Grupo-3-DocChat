import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Carousel from "./components/Carousel/Carousel";
import ChatArea from "./components/ChatArea/ChatArea";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import "./App.css";
import UserPage from "./components/UserPage/UserPage";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user" element={<UserPage />} />
                <Route
                    path="/"
                    element={
                        <>
                            <Header />
                            <Carousel />
                            <ChatArea />
                        </>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;