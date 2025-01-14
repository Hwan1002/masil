import React, { useState, useRef, useContext } from "react";
import "../css/SignUp.css";
import { ProjectContext } from "../context/MasilContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  //회원가입 formData
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    password: "",
    email: "",
  });

  const submitFormData = async (e) => {
    e.preventDefault();
    try {
      debugger;
      const data = new FormData();
      if (profilePhoto) {
        data.append("profilePhoto", profilePhoto);
      }
      data.append(
        "dto",
        new Blob([JSON.stringify(formData)], { type: "application/json" })
      );

      const response = await axios.post("http://localhost:9090/user", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response) {
        alert(response.data.value);
        navigate("/login");
      }
    } catch (error) {
      console.error("에러남" + error);
    }
  };
  //프로필 사진
  const inputImgRef = useRef(null);
  const { imagePreview, setImagePreview } = useContext(ProjectContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
      setProfilePhoto(file); // File 객체로 설정
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
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
            <input
              type="text"
              name="userId"
              className="form-input"
              placeholder="아이디를 입력하세요"
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
            />
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="이메일을 입력하세요."
              onChange={(e) => handleInputChange(e)}
            />
          </div>
        </div>
        <div className="signUp_button">
          <button type="submit">회원가입</button>
          <button type="button" onClick={() => navigate("/")}>
            돌아가기
          </button>
        </div>
      </form>
    </div>
  );
};
export default SignUp;
