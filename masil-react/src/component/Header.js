import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import useModal from '../context/useModal';
import { Api, ProjectContext } from "../context/MasilContext";
import axios from 'axios';

const Header = () => {
  const { loginSuccess, setLoginSuccess, accessToken, setAccessToken } = useContext(ProjectContext);
  const navigate = useNavigate();
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  const logoutClicked = (e) => {
    try {
      const logout = async () => {
        const response = await Api.post('/user/logout',
        )
        if (response) {
          setLoginSuccess(false);
          setAccessToken(null);
          openModal({
            message: response.data.value,
            actions: [{
              label: "확인", onClick: () => {
                closeModal(); window.location.assign("/");
                window.location.reload();
              }
            }]// 명시적 페이지 이동 및 새로고침
          })
        }
      }
      logout();
    } catch (error) {
      openModal({
        message: error.response.data.error,
      })
    }
  }



  return (
    <>
      <header className='header'>
        <div className='header_container'>
          <button className='logo' onClick={() => navigate("/")}>Masil</button>
          <nav className='navBar'>
            <button onClick={() => scrollToSection('about')}>About Me</button>
            <button onClick={() => navigate('/rentalitem')}>중고물건</button>
            <button onClick={() => scrollToSection('archiving')}>Archiving</button>
            <button onClick={() => scrollToSection('project')}>Projects</button>
            <button onClick={() => scrollToSection('career')}>Career</button>
          </nav>
          <div>
            {loginSuccess ? (
              <>
                {/* 로그아웃시 쿠키랑 토큰 삭제 시키는 axios 함수 추가로 인해 onClick안에 하나의 함수로 묶어서 정의 */}
                <button onClick={() => openModal({ message: "로그아웃 하시겠습니까?", actions: [{ label: "확인", onClick: (e) => { logoutClicked(e) } }, { label: "취소", onClick: closeModal }] })}>LOGOUT</button>
                <button onClick={() => navigate("/mypage")}>MYPAGE</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate("/signup")}>SIGNUP</button>
                <button onClick={() => navigate("/login")}>LOGIN</button>
              </>
            )}
          </div>
        </div>
      </header>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        content={modalMessage}
        actions={modalActions}
      />
    </>


  )
}
export default Header;