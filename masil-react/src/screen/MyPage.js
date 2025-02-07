
import React, { useState, useRef, useContext, useEffect } from 'react';
import { ProjectContext } from '../context/MasilContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../component/Modal';
import useModal from '../context/useModal';
import axios from 'axios';
const MyPage = () => {

  const [formData, setFormData] = useState({});
  const {imagePreview, setImagePreview, accessToken} = useContext(ProjectContext);
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const getUserInfo = async()=>{
      const response = await axios.get(`http://localhost:9090/user/userInfo`,
          {
          headers: {
            Authorization: `Bearer ${accessToken}` // Bearer 토큰 형식
          }
        });
        console.log(response.data.value)
      if(response){
        setFormData(response.data.value);
        // setImagePreview(`http://localhost:9090/${response.data.value.profilePhotoPath}`);
      }
    }
    getUserInfo();
  },[accessToken])

   //프로필 사진
    const inputImgRef = useRef(null); 
    
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
              profilePhoto: file.name,
          }));
          setProfilePhoto(file);
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
            <div className='photoImg'>
                <img src={imagePreview} alt="강병준사진"/>
            </div> 
            {/* {imagePreview? (
              <div className='photoImg'>
                <img src={`http://localhost:9090${formData.profilePhotoPath}`} alt="강병준사진"/>
              </div>    
              ) : ''} */}
                <button type="button" className='profileChangeBtn' onClick={handleProfileClick}>프로필 사진</button>
                <input name="profilePhoto" type="file" accept="image/*" ref={inputImgRef} onChange={ImageUpload} style={{display:"none"}}/>
          </div>
          <div className='inputAll'>
            <input type="text" name="user_name" className="form-input" value={formData.userName} readOnly/>
            <input type="text" name="userId" className="form-input" value={formData.userId} readOnly/>
            <input type="text" name="userNickName" className="form-input" value={formData.userNickName} placeholder='닉네임을 입력하세요' onChange={(e) => {handleInputChange(e)}}/>
          </div>
        </div>
        <div className='signUp_button'>
          <button type="button" onClick={()=> navigate("/")}>돌아가기</button>
          <button type="button">수정하기</button>
        </div>
      </form>
        
    </div>
  )
}
export default MyPage;