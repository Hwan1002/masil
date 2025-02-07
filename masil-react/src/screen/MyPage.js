/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/jsx-no-comment-textnodes */

import React, { useState, useRef, useContext, useEffect } from 'react';
import { ProjectContext } from '../context/MasilContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../component/Modal';
import useModal from '../context/useModal';
import axios from 'axios';
import { api } from '../context/useAxiosInterceptor';
const MyPage = () => {
  const navigate = useNavigate();
  const inputImgRef = useRef(null); 
  const {imagePreview, setImagePreview, accessToken, setAccessToken} = useContext(ProjectContext);
  const [formData, setFormData] = useState({});
  const [password, setPassWord] = useState(''); // 새 비밀번호 입력값 관리: 사용자가 입력하는 새 비밀번호
  const [pwdConfirm, setPwdConfirm] = useState(""); // 비밀번호 확인 입력값 관리: 새 비밀번호와 일치하는지 확인
  
  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  useEffect(() => {
    const getUserInfo = async()=>{
      if(!accessToken) return;
      const response = await axios.get(`http://localhost:9090/user/userInfo`,
          {
          headers: {
            Authorization: `Bearer ${accessToken}` // Bearer 토큰 형식
          }
        });
        if (response && response.data.value) {
          setFormData(response.data.value);
          // profilePhotoPath가 있을 경우 미리보기 설정
          if (response.data.value.profilePhotoPath) {
            setImagePreview(`http://localhost:9090${response.data.value.profilePhotoPath}`);
          }
        }
    }
    getUserInfo();
  },[accessToken, setAccessToken])
  
  // useEffect(() => {
  //   const getUserInfo = async () => {
  //     if (!accessToken) return; 
  //     console.log(accessToken)
  //     const response = await api.get(`/user/userInfo`);
  //     console.log(response.data.value);
  //     if (response && response.data.value) {
  //       setFormData(response.data.value);
  
  //       // profilePhotoPath가 있을 경우 미리보기 설정
  //       if (response.data.value.profilePhotoPath) {
  //         setImagePreview(`http://localhost:9090${response.data.value.profilePhotoPath}`);
  //       }
  //     }
  //   };
  //   getUserInfo();
  // }, [accessToken]);
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const ImageUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
        setFormData((prev) => ({
            ...prev,
            profilePhoto: file.name,
        }));
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    }
  }

  const putUserInfo = async(e) => {
    e.preventDefault();
    const data = new FormData();
    // 프로필 사진이 선택되었다면 FormData에 추가
    if (imagePreview) {
      data.append("profilePhoto", inputImgRef.current.files[0]);
    }

    // 다른 formData는 JSON 형태로 변환하여 'dto'에 담아 추가
    data.append("dto", new Blob([JSON.stringify(formData)], { type: "application/json" }));

    try {
      const response = await axios.put(`http://localhost:9090/user/modify`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${accessToken}`,
        }
      });

      if (response.status === 200) {
        openModal({
          message: response.data.value,
          actions: [{ label: "확인", onClick: () => navigate('/') }]
        });
      }
    } catch (error) {
      openModal({ message: "정보 수정에 실패했습니다. 다시 시도해주세요." });
      console.error(error);
    }
  };




  //비밀번호 변경
  const resetpassword = async () => {
    if (!formData.email) {
      openModal({ message: "이메일 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요." });
      return;
    }

    if (password.trim() === "" || pwdConfirm.trim() === "") {
      openModal({ message: "비밀번호를 입력해주세요." });
      return;
    }

    if (password !== pwdConfirm) {
      openModal({ message: "비밀번호가 일치하지 않습니다." });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:9090/user/ResetPassword`,
        { email: formData.email, password },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log(response.data);
      if (response.status === 200) {
        openModal({
          message: response.data.value,
          // actions: [{ label: "확인", onClick: () => closeModal() }]
        });
      }
    } catch (error) {
      openModal({ message: "비밀번호 변경에 실패했습니다. 다시 시도해주세요." });
      console.error(error);
    }
  };

  const handleProfileClick = () => {
    if (inputImgRef.current) {
      inputImgRef.current.click();
    }
  };

  return (
    <div className='signup_form'>
      <h2>내 정보</h2>
      <form>
        <div className='form_input'>
          <div className='profilePhoto'>
            {imagePreview || formData.profilePhotoPath ? (
              <div className='photoImg'>
                <img src={imagePreview ? imagePreview : `http://localhost:9090${formData.profilePhotoPath}`} alt="image"/>
              </div>
            ) : (
              <div className="photoImgPlaceholder">프로필 사진 없음</div>  // 사진이 없을 때의 대체 이미지
            )}
            <button type="button" className='profileChangeBtn' onClick={handleProfileClick}>프로필 사진</button>
            <input name="profilePhoto" type="file" accept="image/*" ref={inputImgRef} onChange={ImageUpload} style={{display:"none"}}/>
          </div>

          <div className='inputAll'>
            <input type="text" name="userName" className="form-input" value={formData.userName}/>
            <input type="text" name="userNickName" className="form-input" value={formData.userNickName || ''} placeholder='닉네임을 입력하세요' onChange={(e) => { handleInputChange(e) }} />
            <input type="text" name="email" className="form-input" value={formData.email || ''} readOnly />
            <input type="password" name="password" className="form-input" value={password} placeholder='비밀번호' onChange={(e) => setPassWord(e.target.value)} />

            <div className="inputAndBtn">
              <input type="password" placeholder="비밀번호 확인" value={pwdConfirm} onChange={(e) => setPwdConfirm(e.target.value)}/>
              <button type="button" className="myPageSetPasswordBtn" onClick={resetpassword}>확인</button>
            </div>
          </div>

        </div>
        <div className='signUp_button'>
          <button type="button" onClick={() => navigate("/")}>돌아가기</button>
          <button type="button" onClick={(e)=>putUserInfo(e)} >수정하기</button>
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        content={modalMessage}
        actions={modalActions}
      />
    </div>
  )
}
export default MyPage;