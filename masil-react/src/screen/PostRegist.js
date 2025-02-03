import React, { useState } from "react";
import '../css/PostRegist.css';
import camera from '../css/img/photo/camera.png';
import DatePicker from "../component/DatePicker";
import { useNavigate } from "react-router-dom";

const PostRegist = () => {
  const navigate = useNavigate();
  const [price, setPrice] = useState(""); // 가격 상태 초기화
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가
  const [selectedImages, setSelectedImages] = useState([]); // 여러 이미지를 저장하는 배열


  //가격 인풋창 변경상태
  const handleChange = (e) => {
    const value = e.target.value;
    
    // 한글이 포함되어 있는지 확인 (정규식 사용)
    if (/[^0-9]/.test(value)) {
      setErrorMessage("가격 입력란에는 숫자만 입력 가능합니다.");
    } else {
      setErrorMessage(""); // 에러 메시지 초기화
      setPrice(value); // 숫자만 상태에 저장
    }
  };

  const handleFileChange = (e) => {
    // e.target.files -> 사용자가 선택한 파일목록을 가져옴옴
    // Array.from(e.target.files) -> FileList 객체를 배열(Array)로 변환
    // 배열로 반환해야 .map() 사용할때 파일을 쉽게 처리할 수 있음
    const files = Array.from(e.target.files);
    
    //selectedImages (이미 선택된 이미지 개수) + 새로 선택한 files 개수 가 5가 안넘는지 확인
    //5를 초과하면 경고메시지 띄움
    //return을 사용하여 함수 실행을 중단 / 실행을 중단하지 않으면 추가등록을 할 수 있는걸 사전에 방지함함
    if (selectedImages.length + files.length > 5) {
      alert("최대 5개의 사진만 등록할 수 있습니다.");
      return;
    }
  
    //files.map((file) => URL.createObjectURL(file)); 각 파일을 브라우저에서 미리볼 수 있도록 URL 생성성
    const imageUrls = files.map((file) => URL.createObjectURL(file));

    
    setSelectedImages((prevImages) => [...prevImages, ...imageUrls]);
  
    // 파일 선택 창 초기화 방지
    e.target.value = "";
  };
  

  const triggerFileInput = () => {
    document.getElementById("fileInput").click(); // 버튼 클릭 시 파일 선택창 열기
  };

  return (
    <div className="postRegist">
      <h2>게시물 등록</h2>

      <form>
        <div className="formDiv">
          <label>사진</label>
          <button
            type="button"
            className="registPhoto"
            onClick={triggerFileInput}
          >
            <img src={camera} alt="사진 등록" />
          </button>

          {/* multiple 속성 추가, 여러 파일 선택 가능 */}
          <input
            id="fileInput"
            name="profilePhoto"
            type="file"
            accept="image/*"
            multiple // 여러 파일 선택 가능
            style={{ display: "none" }}
            onChange={handleFileChange} // 파일 선택 시 호출
          />

          {/* 선택된 여러 이미지 미리보기 */}
          <div className="imagePreviewContainer">
            {selectedImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`선택된 이미지 ${index + 1}`}
                style={{ width: "100px", height: "100px", marginRight: "10px" }}
              />
            ))}
          </div>
          
          <label>제목</label>
          <input name="title" type="text" placeholder="게시물 제목" />
          <label>가격</label>
          <input
            name="price"
            type="text"
            placeholder="가격 입력"
            onChange={handleChange}
            value={price}
          />
          {/* 에러 메시지 표시 */}
          {errorMessage && <div className="registerror">{errorMessage}</div>}
        </div>
        <div className="formDiv formDiv2">
          <DatePicker />
        </div>
        <div className="formDiv formDiv3">
          <label>설명</label>
          <input type="text" placeholder="등록할 물건의 설명을 작성해주세요." style={{ width: "30em", height: "20em" }} />
        </div>
      </form>
      <div className="registnavigate">
      <button onClick={() => navigate('/rentalitem')}>뒤로가기</button>
      <button onClick={() => navigate('/rentalitem')}>등록하기</button>
      </div>
    </div>
  );
};

export default PostRegist;
