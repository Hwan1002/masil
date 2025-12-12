import React from "react";
import { Routes, Route } from "react-router-dom";
import { ProjectProvider } from "context/MasilContext";
import { ChatProvider } from "context/ChatContext";
import Header from "component/Header";
import SignUp from "screen/SignUp/ui/SignUp";
import Main from "screen/Main/ui/Main";
import MyPage from "screen/MyPage/ui/MyPage";
import Login from "screen/Login/ui/Login";
import UserFindId from "screen/UserFindId/ui/UserFindId";
import UserFindPwd from "screen/UserFindPwd/ui/UserFindPwd";
import PostRegist from "screen/PostRegist/ui/PostRegist";
import RentalItem from "screen/RentalItem/ui/RentalItem";
import MyRental from "screen/MyRental/ui/MyRental";
import SelectedRentalItem from "screen/SelectedRentalItem/ui/SelectedRentalItem";
import MyWishPost from "screen/MyWishPost/ui/MyWishPost";
import Chat from "screen/Chat/ui/Chat";
import ChatRoom from "component/ChatRoom";
import "css/reset.css";

function App() {
  return (
    <ProjectProvider>
      <ChatProvider>
        <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/rentalitem" element={<RentalItem />} />
            <Route path="/myrental" element={<MyRental />} />
            <Route path="/userfindid" element={<UserFindId />} />
            <Route path="/userfindpwd" element={<UserFindPwd />} />
            <Route path="/postRegist" element={<PostRegist />} />
            <Route path="/mywishpost" element={<MyWishPost />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chatroom" element={<ChatRoom />} />
            <Route path="/post/item/:idx" element={<SelectedRentalItem />} />
          </Routes>
        </div>
      </ChatProvider>
    </ProjectProvider>
  );
}

export default App;
