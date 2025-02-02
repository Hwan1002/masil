
import React, { useState, useRef, useContext, useEffect } from 'react';
import { ProjectContext } from '../context/MasilContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../component/Modal';
import useModal from '../context/useModal';
import axios from 'axios';
const MyPage = () => {

  const [formData, setFormData] = useState({
      userId : '',
      userNickName : '',
      password : '',
      user_Name : '',
      email : '',
      profile_Photo : null,
    })
    
    useEffect(() => {
      const getUserInfo = async()=>{
        const response = await axios.get(`http://localhost:9090/user/userInfo`,
           {
            headers: {
              Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJpYXQiOjE3MzgwNTcxNjcsImV4cCI6MTczODA1ODA2N30.l2RC6FMrbga5Ldyg80hxAEpFPSR_iCKfs3Ix_OtiMYQ" // Bearer 토큰 형식
            }
          });

        if(response){
          setFormData(response.data);
        }
      }
      getUserInfo();
    },[])

   //프로필 사진
    const inputImgRef = useRef(null); 
    const {imagePreview, setImagePreview} = useContext(ProjectContext);
    const navigate = useNavigate();

 
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const handleProfileClick = () => {
      if (inputImgRef.current) {
          inputImgRef.current.click();
      }
    };
    const ImageUpload = (e) => {
      e.preventDefault();
      const file = e.target.files[0];
      if (file) {
          setFormData((prev) => ({
              ...prev,
              profile_Photo: file.name,
          }));
          const reader = new FileReader();
          reader.onload = () => {
              setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
      }
  }
 
  return(
    <div className='signup_form'>
      <h2>내 정보</h2>
      <form>
        <div className='form_input'>
          <div className='profilePhoto'>
            {imagePreview !== null? (
              <div className='photoImg'>
                <img src={imagePreview} alt="preview"/>
              </div>    
              ) : ''}
                <button type="button" className='profileChangeBtn' onClick={handleProfileClick}>프로필 사진</button>
                <input name="profilePhoto" type="file" accept="image/*" ref={inputImgRef} onChange={ImageUpload} style={{display:"none"}}/>
          </div>
          <div className='inputAll'>
            {/* <input type="text" name="user_name" className="form-input" placeholder='이름을 입력하세요.'onChange={handleInputChange}/> */}
            <input type="text" name="userId" className="form-input"placeholder='아이디를 입력하세요'/>
            <input type="text" name="userNickName" className="form-input"placeholder='닉네임을 입력하세요'/>
            <input type="email" name="email" className="form-input"placeholder='아이디를 입력하세요'/>
            <input type="password" name="password" className="form-input" placeholder="비밀번호를 입력하세요."/>
            <input type="password" className="form-input"  placeholder="비밀번호 확인"/>
          </div>
        </div>
        <div className='signUp_button'>
          <button type="button">수정하기</button>
          <button type="button" onClick={()=> navigate("/")}>돌아가기</button>
        </div>
      </form>
        
    </div>
  )
}
export default MyPage;