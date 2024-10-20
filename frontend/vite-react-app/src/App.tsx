import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header/Header";
import Carousel from "./components/Carousel/Carousel";
import ChatArea from "./components/ChatArea/ChatArea";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import UserPage from "./components/UserPage/UserPage";

const MainPage: React.FC = () => {
    const { user } = useAuth();
    return (
        <>
            <Header variant="default" />
            <Carousel userId={user ? user.id : ""} />
            <ChatArea />
        </>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/user" element={<UserPage />} />
                    <Route
                        path="/"
                        element={<MainPage />}
                    />
                    <Route
                        path="/chat/:chatId"
                        element={<MainPage />}
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;