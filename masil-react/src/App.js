import "./css/reset.css";
import Header from './component/Header';
import { Route, Routes } from 'react-router-dom';
import { ProjectProvider } from './context/MasilContext';
import SignUp from './screen/SignUp';
import Main from './screen/Main';
import MyPage from './screen/MyPage';
import Login from './screen/Login';
import UserFindId from './screen/UserFindId';
import UserFindPwd from './screen/UserFindPwd';
import PostRegist from './screen/PostRegist';
import RentalItem from "./screen/RentalItem";
///wkselfmf qnwlfjsgl tladjqhwk dhsmfeh sjqclsusdms e
function App() {
  return (
    <ProjectProvider>
    <div className="App">
      <Header />
      <div className='container'>
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/mypage" element={<MyPage/>}/>
          <Route path="/userfindid" element={<UserFindId/>}/>
          <Route path="/userfindpwd" element={<UserFindPwd/>}/>
          <Route path="/postRegist" element={<PostRegist/>}/>
          <Route path="/rentalitem" element={<RentalItem/>}/>
        </Routes>
      </div>
    </div>
    </ProjectProvider>
  );
}

export default App;
