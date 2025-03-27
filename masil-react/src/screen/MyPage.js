
import React, { useState, useRef, useContext, useEffect } from 'react';
import { ProjectContext } from '../context/MasilContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../component/Modal';
import useModal from '../context/useModal';
import axios from 'axios';
import LoadingModal from '../component/LoadingModal';
import '../css/MyPage.css'
import { Api } from '../context/MasilContext';
import userDefault from "../css/img/userDefault.svg";
const MyPage = () => {

  const [formData, setFormData] = useState({});
  const { imagePreview, setImagePreview, accessToken } = useContext(ProjectContext);
  const [isVerified, setIsVerified] = useState(false); // 인증 상태: 이메일 인증 완료 여부
  const [email, setEmail] = useState(''); // 이메일 입력값 관리: 사용자가 입력하는 이메일
  const [password, setPassWord] = useState(''); // 새 비밀번호 입력값 관리: 사용자가 입력하는 새 비밀번호
  const [pwdConfirm, setPwdConfirm] = useState(""); // 비밀번호 확인 입력값 관리: 새 비밀번호와 일치하는지 확인
  const [verifyCode, setVerifyCode] = useState(""); // 인증 코드 입력값 관리: 사용자가 입력한 인증 코드
  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  useEffect(() => {
    const getUserInfo = async () => {
      //accessToken이 없으면 요청하지않음. 
      if (!accessToken) return;

      try {
        const response = await Api.get(`/user/userInfo`);

        console.log(response.data.value);
        if (response && response.data.value) {
          setFormData(response.data.value);

          // profilePhotoPath가 있을 경우 미리보기 설정
          if (response.data.value.profilePhotoPath) {
            setImagePreview(`http://localhost:9090${response.data.value.profilePhotoPath}`);
          }
        }
      } catch (error) {
        console.error("사용자 정보를 불러오는 중 오류 발생:", error);
      }
    };
    console.log("내토큰", accessToken)
    if (accessToken) {
      getUserInfo();
    }
  }, [accessToken]);


  //이메일 인증번호 전송 요청
  const sendCertifyNumber = async (e) => {
    e.preventDefault();
    openModal({
      title: "전송 중",
      message: <LoadingModal />,
    });
    try {
      const response = await axios.post(`http://localhost:9090/user/findPassword`, { email: email });
      if (response) {
        openModal({
          message: response.data.value
        })
      }
    } catch (error) {
      openModal({
        message: error.response.data.error
      })
    }
  }

  //인증번호 일치여부
  const emailCertified = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:9090/user/verify`, {
        email: email, verifyCode: verifyCode
      });
      if (response) {
        setIsVerified(true);
        openModal({
          message: response.data.value,
          message: "비밀번호 설정 페이지로 넘어갑니다."
        })
      }
    } catch (error) {
      openModal({
        message: error.response.data.error
      })
    }
  }

  // 엔터 키 전송
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (e.target.name === "email") {
        sendCertifyNumber(e); // 이메일 전송 버튼 기능 실행
      } else if (e.target.name === "verifyCode") {
        emailCertified(e); // 인증번호 확인 버튼 기능 실행
      } else if (isVerified && e.target.name === "passwordConfirm") {
        handleSubmit(e); // 비밀번호 변경 제출 실행
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 동작 방지

    if (pwdConfirm !== password) {
      openModal({
        message: "비밀번호가 일치하지 않습니다.",
      });
      return;
    }

    if (email.trim() === '') {
      openModal({
        title: `이메일 입력`,
        message: `이메일을 입력해주세요.`,
      });
      return;
    }
  };

  const putUserInfo = async () => {
    const data = new FormData();

    // 프로필 사진이 선택되었다면 FormData에 추가
    if (imagePreview) {
      data.append("profilePhoto", inputImgRef.current.files[0]);
    }

    // 다른 formData는 JSON 형태로 변환하여 'dto'에 담아 추가
    data.append("dto", new Blob([JSON.stringify(formData)], { type: "application/json" }));

    try {
      const response = await Api.put(`/user/modify`, data,);

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

  // 프로필사진업로드
  const ImageUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      // 선택한 파일을 formData에 추가
      setFormData((prev) => ({
        ...prev,
        profile_Photo: file.name,  // 파일의 이름을 formData에 저장
      }));

      // 미리보기 이미지를 업데이트
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);  // 미리보기 이미지 업데이트
      };
      reader.readAsDataURL(file);
    }
  };


  // 프로필사진 기본이미지로 변경 :
  const basicImage = (e) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      profilePhotoPath:'default',
    }));
    console.log(formData)
      setImagePreview(userDefault);  // 미리보기 이미지 업데이트
  }







  return (
    <div className='signup_form'>
      <h2>내 정보</h2>
      <form>
        <div className='form_input'>
          <div className='profilePhoto'>
            {imagePreview || formData.profilePhotoPath ? (
              <div className='photoImg'>
                <img
                  src={imagePreview ? imagePreview : `http://localhost:9090${formData.profilePhotoPath}`}
                  alt="image"
                />
              </div>
            ) : (
              <div className="photoImgPlaceholder">프로필 사진 없음</div>  // 사진이 없을 때의 대체 이미지
            )}
            <button type="button" className='profileChangeBtn' onClick={handleProfileClick}>프로필 사진</button>
            <button type="button" className='profileChangeBtn' onClick={basicImage}>기본이미지</button>
            <input
              name="profilePhoto"
              type="file"
              accept="image/*"
              ref={inputImgRef}
              onChange={ImageUpload}
              style={{ display: "none" }}
            />
          </div>

          <div className='inputAll'>
            <input type="text" name="user_name" className="form-input" value={formData.email || ''} readOnly />
            <input type="text" name="userNickName" className="form-input" value={formData.userNickName || ''} placeholder='닉네임을 입력하세요' onChange={(e) => { handleInputChange(e) }} />


            {!isVerified ? (
              <>
                <div className="myPageEmailContainer">
                  <div className="myPageEmailInput">
                    <input
                      className='FindId_input'
                      type='email'
                      name='email'
                      placeholder='이메일 입력'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                    <button
                      type="submit"
                      className='myPageSendBtn'
                      onClick={(e) => sendCertifyNumber(e)}
                    >
                      전송
                    </button>
                  </div>
                </div>

                <div className="myPageEmailContainer">
                  <div className="myPageEmailInput">
                    <input
                      className='FindId_input'
                      type='text'
                      name='verifyCode'
                      placeholder='인증번호 입력'
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                    <button
                      type="submit"
                      className='myPageSendBtn'
                      onClick={(e) => emailCertified(e)}
                    >
                      인증
                    </button>
                  </div>
                </div>

              </>
            ) : (
              <div className='myPageEmailContainer'>
                <input type="password" name="password" value={password} placeholder='비밀번호' onChange={(e) => setPassWord(e.target.value)} />
                <div className='myPageEmailInput'>
                  <input
                    type="password"
                    placeholder="비밀번호 확인"
                    value={pwdConfirm}
                    onChange={(e) => setPwdConfirm(e.target.value)}
                  />
                  <button
                    type="submit"
                    className='myPageSendBtn'
                    onClick={resetpassword}
                  >
                    변경
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
        <div className='signUp_button'>
          <button type="button" onClick={() => navigate("/")}>돌아가기</button>
          <button type="button" onClick={putUserInfo} >수정하기</button>
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