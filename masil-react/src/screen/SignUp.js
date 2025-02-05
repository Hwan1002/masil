import React, { useState, useRef, useContext,useEffect } from "react";
import "../css/SignUp.css";
import { ProjectContext } from "../context/MasilContext";
import { useNavigate } from "react-router-dom";
import Modal from "../component/Modal";
import useModal from "../context/useModal";
import LoadingModal from "../component/LoadingModal";
import axios from "axios";

const SignUp = () => {
  //프로필사진 상태
  const [profilePhoto, setProfilePhoto] = useState(null);
  //중복체크 & 이메일 인증 버튼 눌렀는지
  const [duplicateBtn, setDuplicateBtn] = useState(false);
  const [certifiedBtn, setCertifiedBtn] = useState(false);
  //비밀번호 확인  & 인증코드 상태 따로 관리
  const [pwdConfirm, setPwdConfirm] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  //이메일 인증 보낼때 나타나는 타이머 상태
  const [timer, setTimer] = useState(-1);
  //이메일 readonly 관리 
  const [isReadonly, setIsReadOnly] = useState(false);
  //회원가입 formData
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    userNickName: "",
    password: "",
    email: "",
  });
  const {isLoading,setIsLoading} = useContext(ProjectContext);
  const navigate = useNavigate();
 
  //모달 기능 사용
  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  //회원가입 버튼 클릭 함수
  const submitFormData = async (e) => {
    e.preventDefault();
    //빈값확인
    const isEmpty = Object.values(formData).some((value) => !value);
    if (isEmpty) {
      openModal({
        message: "빈칸을 입력해주세요.",
      });
      return;
    }
    //중복체크 눌렀는지
    if (!duplicateBtn) {
      openModal({
        message: "아이디 중복 확인해주세요.",
      });
      return;
    }
    //비밀번호 불일치
    if (pwdConfirm !== formData.password) {
      openModal({
        message: "비밀번호가 일치하지 않습니다.",
      });
      return;
    }
    // if(!certifiedBtn){
    //   openModal({
    //     message: "이메일 인증을 해주세요.",
    //   });
    //   return;
    // }
    try {
      const data = new FormData();
      if (profilePhoto) {
        data.append("profilePhoto", profilePhoto);
      }
      data.append("dto", new Blob([JSON.stringify(formData)], { type: "application/json" }));
      const response = await axios.post("http://localhost:9090/user", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response) {
        openModal({
          title: "회원가입",
          message: response.data.value,
          actions: [{label: "확인", onClick:()=>{ closeModal(); navigate("/login"); }}],
        });
      }
    } catch (error) {
      openModal({
        title: "회원가입",
        message: error.response.data.error,
      });
    }
  };

  //프로필 사진
  const inputImgRef = useRef(null);
  const { imagePreview, setImagePreview } = useContext(ProjectContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // if ((name = "email")) {
    //   if (emailRegex.test(value)) {
    //     setFormData({ ...formData, [name]: value });
    //   } else {
    //     openModal({
    //       message: "옳바른 이메일 형식을 입력하세요.",
    //     });
    //     return;
    //   }
    // } else {
    setFormData({ ...formData, [name]: value });
    // }
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
      setProfilePhoto(file); // File 객체로 설정
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const idDuplicate = async (e) => {
    e.preventDefault();
    if(!formData.userId){
      openModal({
        message:"아이디를 입력해주세요."
      })
      return;
    }
    try {
      const response = await axios.get("http://localhost:9090/user", {
        params: { userId: formData.userId },
      });
      console.log(response.data);
      if (response.data) {
        openModal({
          message: "중복된 아이디입니다.",
        });
      } else {
        setDuplicateBtn(true);
        openModal({
          message: "사용가능한 아이디입니다.",
        });
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const sendCertifyNumber = async(e) => {
    e.preventDefault();
    if(formData.email === ''){
      openModal({
        message: "이메일을 작성해주세요.",
      })
      return;
    }
    setIsLoading(true);
    openModal({
      title:"전송 중",
      message: <LoadingModal/>,
    });
    try {
      const response = await axios.post('http://localhost:9090/user/send-email',{email:formData.email});
      if(response){
        setIsReadOnly(true);
        setIsLoading(false);
        setCertifiedBtn(true);
        openModal({
          message:response.data.value,
        })
        setTimer(300);
        
        const timerInterval = setInterval(() => {
          setTimer(prev => {
            if (prev <= 1) {
              clearInterval(timerInterval);
              setCertifiedBtn(false);
              setIsReadOnly(false);
              return 0;
            }
            
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      setIsLoading(false);
      openModal({
        message:error.response.data.error,
      })
    }
  }
  const emailCertified = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9090/user/verify',{
      email:formData.email,verifyCode:verifyCode});
      if(response){
        setCertifiedBtn(false);
        openModal({
          message:response.data.value
        })
      }
    } catch (error) {
      console.log(error.response.data.error);
    }
  }
  return (
    <div className="signup_form">
      <h2>회원가입</h2>
      <form onSubmit={(e) => submitFormData(e)}>
        <div className="form_input">
          <div className="profilePhoto">
            {imagePreview !== null ? (
              <div className="photoImg">
                <img src={imagePreview} alt="preview" />
              </div>
            ) : (
              ""
            )}
            <button
              type="button"
              className="profileChangeBtn"
              onClick={handleProfileClick}
            >
              프로필 사진
            </button>
            <input
              name="profilePhoto"
              type="file"
              accept="image/*"
              ref={inputImgRef}
              onChange={ImageUpload}
              style={{ display: "none" }}
            />
          </div>
          <div className="inputAll">
            <input
              type="text"
              name="userName"
              className="form-input"
              placeholder="이름을 입력하세요."
              onChange={(e) => handleInputChange(e)}
            />
            <div className="inputAndBtn">
              <input
                type="text"
                name="userId"
                className="form-input"
                placeholder="아이디를 입력하세요"
                onChange={(e) => handleInputChange(e)}
              />
              <button type="button" onClick={(e) => idDuplicate(e)}>
                중복확인
              </button>
            </div>
            <input
                type="text"
                name="userNickName"
                className="form-input"
                placeholder="닉네임을 입력하세요"
                onChange={(e) => handleInputChange(e)}
              />
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="비밀번호를 입력하세요."
              onChange={(e) => handleInputChange(e)}
            />
            <input
              type="password"
              className="form-input"
              placeholder="비밀번호 확인"
              onChange={(e) => setPwdConfirm(e.target.value)}
            />
            <div className="inputAndBtn">
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="이메일을 입력하세요."
                onChange={(e) => handleInputChange(e)}
                readOnly={isReadonly}
              />
              {certifiedBtn === false && timer <= 0? (
                <button type="button" onClick={(e)=>sendCertifyNumber(e)}>인증</button>
              ):(<button type="button" onClick={(e)=>sendCertifyNumber(e)}>재인증</button>)}
            </div>
            {timer > 0 && certifiedBtn? (
              <div className="inputAndBtn emailCertified">
                <input type="text" placeholder="인증번호를 입력해주세요." className="form-input" onChange={(e)=>setVerifyCode(e.target.value)}/>
                <button button onClick={(e)=>emailCertified(e)}>확인</button>
                <div className="timer">
                  남은 시간: {Math.floor(timer / 60)}분 {timer % 60}초
                </div>
              </div>
            ):("")
            }
          </div>
        </div>
        <div className="signUp_button">
        <button type="button" onClick={() => navigate("/")}>돌아가기</button>
          <button type="submit">회원가입</button>
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        content={modalMessage}
        actions={modalTitle === "전송 중" ? [] : modalActions}
      />
    </div>
  );
};
export default SignUp;
