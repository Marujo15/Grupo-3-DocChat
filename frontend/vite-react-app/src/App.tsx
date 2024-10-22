import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
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

const UserProfilePage: React.FC = () => {
    const { user } = useAuth();
    return (
        <>
            <UserPage userId={user ? user.id : ""} />
        </>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <ChatProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/user" element={<UserProfilePage />} />
                        <Route path="/" element={<MainPage />} />
                        <Route path="/chat/:chatId" element={<MainPage />} />
                        <Route path="/chat/" element={<MainPage />} />
                    </Routes>
                </Router>
            </ChatProvider>
        </AuthProvider>
    );
};

export default App;