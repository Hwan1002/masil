import Header from "./component/Header";
import { Route, Routes } from "react-router-dom";
import { ProjectProvider } from "./context/MasilContext";
import SignUp from "./screen/SignUp";
import Main from "./screen/Main";
import MyPage from "./screen/MyPage";
import Login from "./screen/Login";
import UserFindId from "./screen/UserFindId";
import UserFindPwd from "./screen/UserFindPwd";
import PostRegist from "./screen/PostRegist";
import RentalItem from "./screen/RentalItem";
import MyRental from "./screen/MyRental";
import SelectedRentalItem from "./screen/SelectedRentalItem";
import MyWishPost from "./screen/MyWishPost";
import Chat from "./screen/Chat";
import "./css/reset.css";

function App() {
  return (
    <ProjectProvider>
      <div className="App">
        <Header />
        <Routes>
          <Route
            path="/*"
            element={
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
                </Routes>
              </div>
            }
          />
          <Route path="/rentalitem" element={<RentalItem />} />
          <Route path="/myrental" element={<MyRental />} />
          <Route path="/post/item/:idx" element={<SelectedRentalItem />} />
        </Routes>
      </div>
    </ProjectProvider>
  );
}

export default App;
