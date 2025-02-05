import '../css/Main.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
const Main = () => {
  const navigate = useNavigate();
  
  return(
    <>
    <div className="mainContents">
      <div>메인페이지다 싀발</div>
      <div>메인페이지다 싀발</div>
      <div>메인페이지다 싀발</div>
    </div>
      
    </>
  )
}
export default Main;