import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api, ProjectContext } from "context/MasilContext";
import useModal from "context/useModal";
import LoadingModal from "component/LoadingModal";
import userDefault from "css/img/userDefault.svg";

export const useMyPage = () => {
  const { imagePreview, setImagePreview, accessToken, location } =
    useContext(ProjectContext);

  const inputImgRef = useRef(null);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [isVerified, setIsVerified] = useState(false); // 인증 상태: 이메일 인증 완료 여부
  const [email, setEmail] = useState(""); // 이메일 입력값 관리: 사용자가 입력하는 이메일
  const [password, setPassWord] = useState(""); // 새 비밀번호 입력값 관리: 사용자가 입력하는 새 비밀번호
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
      if (!accessToken) return;

      try {
        const response = await Api.get(`/user/userInfo`);

        console.log(response.data.value);
        if (response && response.data.value) {
          setFormData(response.data.value);

          // profilePhotoPath가 있을 경우 미리보기 설정
          if (response.data.value.profilePhotoPath) {
            setImagePreview(
              `http://localhost:9090${response.data.value.profilePhotoPath}`
            );
          }
        }
      } catch (error) {
        console.error("사용자 정보를 불러오는 중 오류 발생:", error);
      }
    };
    if (accessToken) {
      getUserInfo();
    }
  }, [accessToken, setImagePreview]);

  useEffect(() => {
    if (location?.address) {
      setFormData((prev) => ({
        ...prev,
        address: location.address,
        lat: location.lat,
        lng: location.lng,
      }));
    }
  }, [location]);

  //이메일 인증번호 전송 요청
  const sendCertifyNumber = async (e) => {
    e.preventDefault();
    openModal({
      title: "전송 중",
      message: <LoadingModal />,
    });
    try {
      const response = await Api.post(
        `http://localhost:9090/user/findPassword`,
        { email: email }
      );
      if (response) {
        openModal({
          message: response.data.value,
        });
      }
    } catch (error) {
      openModal({
        message: error.response.data.error,
      });
    }
  };

  //인증번호 일치여부
  const emailCertified = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.post(`http://localhost:9090/user/verify`, {
        email: email,
        verifyCode: verifyCode,
      });
      if (response) {
        setIsVerified(true);
        openModal({
          message: response.data.value,
        });
      }
    } catch (error) {
      openModal({
        message: error.response.data.error,
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 동작 방지

    if (pwdConfirm !== password) {
      openModal({
        message: "비밀번호가 일치하지 않습니다.",
      });
      return;
    }

    if (email.trim() === "") {
      openModal({
        title: `이메일 입력`,
        message: `이메일을 입력해주세요.`,
      });
      return;
    }
  };

  // 엔터 키 누르면 전송
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

  const putUserInfo = async () => {
    const data = new FormData();
    console.log("폼데이터", formData);
    if (imagePreview && formData.profilePhotoPath !== "default") {
      data.append("profilePhoto", inputImgRef.current.files[0]);
    }

    data.append(
      "dto",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );

    try {
      const response = await Api.put(`/user/modify`, data);
      if (response.status === 200) {
        openModal({
          message: response.data.value,
          actions: [{ label: "확인", onClick: () => navigate("/") }],
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
      openModal({
        message: "이메일 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.",
      });
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
      const response = await Api.put(
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
      openModal({
        message: "비밀번호 변경에 실패했습니다. 다시 시도해주세요.",
      });
      console.error(error);
    }
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
      // 새로 선택한 파일의 미리보기 업데이트
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result); // 미리보기 이미지 업데이트
      };
      reader.readAsDataURL(file);

      // 선택한 파일을 formData에 추가
      setFormData((prev) => ({
        ...prev,
        profilePhotoPath: file.name, // 서버로 보낼 파일명 저장
      }));
    }
  };

  // 프로필사진 기본이미지로 변경
  const basicImage = (e) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      profilePhotoPath: "default", // 기본 이미지로 변경
    }));
    setImagePreview(userDefault); // 기본 이미지 파일 경로로 설정
  };

  return {
    formData,
    isVerified,
    email,
    password,
    pwdConfirm,
    verifyCode,
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    inputImgRef,
    imagePreview,
    userDefault,
    navigate,
    setEmail,
    setVerifyCode,
    setPassWord,
    setPwdConfirm,
    openModal,
    closeModal,
    sendCertifyNumber,
    emailCertified,
    handleInputChange,
    handleSubmit,
    handleKeyPress,
    putUserInfo,
    resetpassword,
    handleProfileClick,
    ImageUpload,
    basicImage,
  };
};
