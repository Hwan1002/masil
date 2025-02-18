import '../css/Main.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
const Main = () => {
  const navigate = useNavigate();
  
  return(
    <>
    <div className="mainContents">
      <div>메인페이지 디자인 예정</div>
      <div>메인페이지 디자인 예정</div>
      <div>메인페이지 디자인 예정</div>
      <div>메인페이지 디자인 예정</div>
      <div>메인페이지 디자인 예정</div>
      <button onClick={()=>navigate("/postRegist")}>+</button>
    </div>
      
    </>
  )
}
export default Main;
