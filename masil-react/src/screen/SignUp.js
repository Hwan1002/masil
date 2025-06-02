import React, { useState, useRef, useContext, useEffect } from "react";
import userDefault from "../css/img/userDefault.svg";
import { ProjectContext } from "../context/MasilContext";
import { useNavigate } from "react-router-dom";
import Modal from "../component/Modal";
import useModal from "../context/useModal";
import LoadingModal from "../component/LoadingModal";
import axios from "axios";
import LocationPicker from "../component/LocationPicker";
import "../css/SignUp.css";

const SignUp = () => {
  const { location, setLocation } = useContext(ProjectContext);
  //프로필사진 상태
  const [profilePhoto, setProfilePhoto] = useState(null);
  //중복체크 & 이메일 인증 버튼 눌렀는지
  const [duplicateBtn, setDuplicateBtn] = useState(false);
  const [certifiedBtn, setCertifiedBtn] = useState(false);
  const [verifyCodeConfirm, setVerifyCodeConfirm] = useState(false);
  //이메일 인증 완료 여부
  const [isEmailVerified, setIsEmailVerified] = useState(false);
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

  const { setIsLoading } = useContext(ProjectContext);
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

  //프로필 사진
  const inputImgRef = useRef(null);
  const { imagePreview, setImagePreview } = useContext(ProjectContext);
  useEffect(() => {
    setImagePreview(userDefault);
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
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
  };
  const idDuplicate = async (e) => {
    e.preventDefault();
    if (!formData.userId) {
      openModal({
        message: "아이디를 입력해주세요.",
      });
      return;
    }
    try {
      const response = await axios.get("http://localhost:9090/user", {
        params: { userId: formData.userId },
      });
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

  const sendCertifyNumber = async (e) => {
    e.preventDefault();
    if (formData.email === "") {
      openModal({
        message: "이메일을 작성해주세요.",
      });
      return;
    }
    setIsLoading(true);
    openModal({
      title: "전송 중",
      message: <LoadingModal />,
    });
    try {
      const response = await axios.post(
        "http://localhost:9090/user/send-email",
        { email: formData.email }
      );
      if (response) {
        setIsReadOnly(true);
        setIsLoading(false);
        setCertifiedBtn(true);
        openModal({
          message: response.data.value,
        });
        setTimer(300);

        const timerInterval = setInterval(() => {
          setTimer((prev) => {
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
        message: error.response.data.error,
      });
    }
  };
  const emailCertified = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9090/user/verify", {
        email: formData.email,
        verifyCode: verifyCode,
      });
      if (response) {
        setIsEmailVerified(true);
        setCertifiedBtn(false);
        setVerifyCodeConfirm(true);
        openModal({
          message: response.data.value,
        });
      }
    } catch (error) {
      setIsEmailVerified(false);
      setCertifiedBtn(true);
      openModal({
        message: error.response.data.error,
      });
    }
  };
  //회원가입 버튼 클릭 함수
  const submitFormData = async (e) => {
    e.preventDefault();
    //빈값확인
    const isEmpty = Object.values(formData).some((value) => !value);
    console.log("formdata", formData);
    console.log("이건", isEmpty);
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

    if (!verifyCodeConfirm) {
      openModal({
        message: "이메일 인증을 해주세요.",
      });
      return;
    }
    try {
      const data = new FormData();
      if (profilePhoto) {
        data.append("profilePhoto", profilePhoto);
      }
      data.append(
        "dto",
        new Blob(
          [
            JSON.stringify({
              ...formData,
              address: location.address,
              lat: location.lat,
              lng: location.lng,
            }),
          ],
          { type: "application/json" }
        )
      );
      const response = await axios.post("http://localhost:9090/user", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response) {
        openModal({
          title: "회원가입",
          message: response.data.value,
          actions: [
            {
              label: "확인",
              onClick: () => {
                closeModal();
                navigate("/login");
              },
            },
          ],
        });
      }
    } catch (error) {
      //이메일 v
      setFormData({ ...formData, email: "" });
      setIsReadOnly(false);
      openModal({
        title: "회원가입",
        message: error.response.data.error,
      });
    } finally {
      setLocation({}); // 항상 location 초기화
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      if (!navigator.geolocation) return; // 브라우저가 위치 정보를 지원하지 않으면 종료

      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.post("http://localhost:9090/location", {
            lat: latitude,
            lng: longitude,
          });
          const { address } = response.data;
          setLocation({
            lat: latitude,
            lng: longitude,
            address,
          });
        } catch (err) {
          console.error("서버 요청 실패:", err.message);
        }
      });
    };

    fetchLocation(); // 페이지 로드 시 위치 정보 자동으로 가져오기
  }, []); // 컴포넌트가 처음 렌더링될 때만 실행

  return (
    <div className="signup_form">
      <div className="signup_form_container">
        <h2>회원가입</h2>

        <form onSubmit={submitFormData}>
          {/* Profile Photo Section */}
          <section className="profilePhoto">
            <div className="photoImg">
              <img src={imagePreview} alt="프로필 사진" />
            </div>
            <button
              type="button"
              onClick={handleProfileClick}
              className="profileChangeBtn"
            >
              프로필 사진 변경
            </button>
            <input
              type="file"
              ref={inputImgRef}
              onChange={ImageUpload}
              accept="image/*"
              className="hidden"
            />
            {/* Location Picker Section */}
            <div className="inputAll">
              <label className="dpLabel">나의 위치</label>
              <LocationPicker />
            </div>
          </section>

          {/* User Information Section */}
          <section className="form_input">
            {/* ID Field */}
            <div className="inputAll">
              <label className="dpLabel" htmlFor="userId">
                아이디
              </label>
              <div className="inputAndBtn">
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  className="form-input"
                  value={formData.userId}
                  onChange={handleInputChange}
                  placeholder="아이디를 입력하세요"
                />
                <button type="button" onClick={idDuplicate}>
                  중복확인
                </button>
              </div>
            </div>

            {/* Name Field */}
            <div className="inputAll">
              <label className="dpLabel" htmlFor="userName">
                이름
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                className="form-input"
                value={formData.userName}
                onChange={handleInputChange}
                placeholder="이름을 입력하세요"
              />
            </div>

            {/* Nickname Field */}
            <div className="inputAll">
              <label className="dpLabel" htmlFor="userNickName">
                닉네임
              </label>
              <input
                type="text"
                id="userNickName"
                name="userNickName"
                className="form-input"
                value={formData.userNickName}
                onChange={handleInputChange}
                placeholder="닉네임을 입력하세요"
              />
            </div>

            {/* Password Fields */}
            <div className="inputAll">
              <label className="dpLabel" htmlFor="password">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            <div className="inputAll">
              <label className="dpLabel" htmlFor="pwdConfirm">
                비밀번호 확인
              </label>
              <input
                type="password"
                id="pwdConfirm"
                name="pwdConfirm"
                className="form-input"
                value={pwdConfirm}
                onChange={(e) => setPwdConfirm(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>

            {/* Email Verification Section */}
            <div className="inputAll">
              <label className="dpLabel" htmlFor="email">
                이메일
              </label>
              <div className="inputAndBtn">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="이메일을 입력하세요"
                  readOnly={isReadonly}
                />
                <button
                  type="button"
                  onClick={sendCertifyNumber}
                  disabled={certifiedBtn}
                >
                  인증번호 전송
                </button>
              </div>
              {timer > 0 && (
                <div className="timer">
                  {Math.floor(timer / 60)}:
                  {(timer % 60).toString().padStart(2, "0")}
                </div>
              )}
            </div>

            {certifiedBtn && (
              <div className="inputAll">
                <label className="dpLabel" htmlFor="verifyCode">
                  인증번호
                </label>
                <div className="inputAndBtn">
                  <input
                    type="text"
                    id="verifyCode"
                    name="verifyCode"
                    className="form-input"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    placeholder="인증번호를 입력하세요"
                  />
                  <button
                    type="button"
                    onClick={emailCertified}
                    disabled={verifyCodeConfirm}
                  >
                    인증확인
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Submit Buttons */}
          <div className="signUp_button">
            <button type="button" onClick={() => navigate(-1)}>
              취소
            </button>
            <button type="submit">가입하기</button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          title={modalTitle}
          content={modalMessage}
          actions={modalActions}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default SignUp;
