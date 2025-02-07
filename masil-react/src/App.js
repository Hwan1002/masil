import "./css/reset.css";
import { useEffect,useContext } from "react";
import Header from './component/Header';
import { Route, Routes } from 'react-router-dom';
import { ProjectProvider } from './context/MasilContext';
import Modal from "./component/Modal";
import useModal from './context/useModal';
import SignUp from './screen/SignUp';
import Main from './screen/Main';
import MyPage from './screen/MyPage';
import Login from './screen/Login';
import UserFindId from './screen/UserFindId';
import UserFindPwd from './screen/UserFindPwd';
import PostRegist from './screen/PostRegist';
import RentalItem from "./screen/RentalItem";

function App() {
  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();
  
  
  useEffect(() => {
    const handleRefreshAttempt = (e) => {
      e.preventDefault();
      openModal({
        title: "초기화 경고",
        message: "새로고침하면 데이터가 초기화됩니다. 계속하시겠습니까?",
        actions: [
          {
            label: "확인",
            onClick: () => {
              closeModal();
              window.location.reload();
            },
            className: "confirm-btn",
          },
          {
            label: "취소",
            onClick: closeModal,
            className: "cancel-btn",
          },
        ],
      });
    };
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.key === "r") || e.key === "F5") {
        e.preventDefault();
        handleRefreshAttempt(e);
      }
    };
    const handlePopState = (e) => {
      e.preventDefault();
      handleRefreshAttempt(e);
    };
  
    window.addEventListener("keydown", handleKeyDown);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [openModal, closeModal]);
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
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        content={modalMessage}
        actions={modalActions}
      />
    </div>
    </ProjectProvider>
  );
}

export default App;
