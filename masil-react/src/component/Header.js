import React from 'react';
import {useNavigate} from 'react-router-dom';
const Header = () => {
  
    const navigate = useNavigate();
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
    };
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
              <button onClick={()=>navigate("/signup")}>SIGNUP</button>
              <button onClick={()=>navigate("/login")}>LOGIN</button>
              <button onClick={()=>navigate("/mypage")}>MYPAGE</button>
            </div>
          </div>
        </header>
      
        </>
        
        
    )
}
export default Header;