import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header/Header";
import Carousel from "./components/Carousel/Carousel";
import ChatArea from "./components/ChatArea/ChatArea";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import UserPage from "./components/UserPage/UserPage";
// import NewConversation from "./components/NewConversation/NewConversation";

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
                        element={
                            <>
                                <Header variant="default" />
                                <Carousel />
                                <ChatArea />
                            </>
                        }
                    />
                    {/* <Route path="/new-conversation" element={<NewConversation />} /> */}
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;