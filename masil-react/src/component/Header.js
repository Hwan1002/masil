import React, { useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import Modal from './Modal';
import useModal from '../context/useModal';
import { ProjectContext } from "../context/MasilContext";

const Header = () => {
    const {loginSuccess} = useContext(ProjectContext);
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
    return(
        <>
        <header className='header'>
          <div className='header_container'>
            <button className='logo' onClick={()=>navigate("/")}>Masil</button>
            <nav className='navBar'>
              <button onClick={() => scrollToSection('about')}>About Me</button>
              <button onClick={() => navigate('/rentalitem')}>중고물건</button>
              <button onClick={() => scrollToSection('archiving')}>Archiving</button>
              <button onClick={() => scrollToSection('project')}>Projects</button>
              <button onClick={() => scrollToSection('career')}>Career</button>
            </nav>
            <div>
              {loginSuccess? (
                <>
                  <button onClick={()=>openModal({message:"로그아웃 하시겠습니까?",actions:[{label:"확인",onClick:()=>{closeModal();navigate("/login")}}]})}>LOGOUT</button>
                  <button onClick={()=>navigate("/mypage")}>MYPAGE</button>
                </>
              ):(
                <>
                  <button onClick={()=>navigate("/signup")}>SIGNUP</button>
                  <button onClick={()=>navigate("/login")}>LOGIN</button>
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