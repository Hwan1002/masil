import React, { useState } from "react";
import '../css/PostRegist.css';
import camera from '../css/img/photo/camera.png';
import DatePicker from "../component/DatePicker";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PostRegist = () => {
  const navigate = useNavigate();
  const [commaPrice, setCommaPrice] = useState("");
  const [price, setPrice] = useState(""); // 가격 상태 초기화
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가
  const [selectedImages, setSelectedImages] = useState([]); // 여러 이미지를 저장하는 배열

  //DatePicker 에서 값 받아옴
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleSubmit = async(e) => {
    e.preventDefault();  // 기본 폼 제출을 방지
    debugger;
    // 여기에 폼 제출 후 처리 로직 추가
    console.log("대여 시작 시간:", startDate);
    console.log("대여 종료 시간:", endDate);
    try {
      const data = new FormData();
      if (selectedImages) {
        data.append("postPhoto", selectedImages);
      }
      const response = await axios.post('http://localhost:9090/post/upload',)
    } catch (error) {
      
    }
    console.log('폼 제출');
  };
  

  //가격 인풋창 변경상태
  const handleChange = (e) => {
    // const value = e.target.value;
    const rawValue = e.target.value.replace(/,/g, "");
    // 숫자인 경우만 상태 업데이트
    if (!isNaN(rawValue)) {
      setCommaPrice(Number(rawValue).toLocaleString()); // 천 단위 콤마 추가
      setPrice(rawValue);
    }
    if (/[^0-9]/.test(price)) {
      setErrorMessage("가격 입력란에는 숫자만 입력 가능합니다.");
    } else {
      setErrorMessage(""); // 에러 메시지 초기화
      setPrice(rawValue); // 숫자만 상태에 저장
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
    if (selectedImages.length + files.length > 4) {
      alert("최대 4개의 사진만 등록할 수 있습니다.");
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

  // 이미지 미리보기 삭제
  const handleRemoveImage = (indexToRemove) => {
    const isConfirmed = window.confirm("선택한 사진을 삭제하시겠습니까?");
    
    if (!isConfirmed) {
      console.log("삭제 취소됨"); // 디버깅용 로그
      return; // 취소 시 함수 종료
    }
  
    console.log("삭제 진행"); // 디버깅용 로그
    setSelectedImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };
  
  
  


  return (
    <div className="postRegist">
      <h2>게시물 등록</h2>

      <form onSubmit={(e)=>handleSubmit(e)}>
        <div className="formDiv">
          <label>사진({selectedImages.length}/4)</label>
          <div className="photoContainer"> {/* 추가된 div */}
            <button
             type="button"
              className="registPhoto"
              onClick={triggerFileInput}
            >
              <img src={camera} alt="사진 등록" />
            </button> 
            <input
              id="fileInput"
              name="profilePhoto"
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {/* 선택된 여러 이미지 미리보기 */}
            <div className="imagePreviewContainer">
              {selectedImages.map((image, index) => (
                <div key={index} className="imageWrapper">
                  <img src={image} alt={`선택된 이미지 ${index + 1}`} className="previewImage" />
                  <button className="deleteButton" onClick={() => handleRemoveImage(index)}>✖</button>
                </div>
              ))}
            </div>

          </div>

          <label>제목</label>
          <input name="postTitle" type="text" placeholder="게시물 제목" maxlength="40" onChange={handleChange}/>
          <label>가격</label>
          <input
            name="postPrice"
            type="text"
            placeholder="가격 입력"
            onChange={handleChange}
            value={commaPrice}
            maxlength="12"
          />
          {/* 에러 메시지 표시 */}
          {errorMessage && <div className="registerror">{errorMessage}</div>}
        </div>
        <div className="formDiv">
          <DatePicker />
        </div>
        <div className="formDiv">
          <label>설명</label>
          <textarea className="registdescription" name="description" placeholder="등록할 물건의 설명을 작성해주세요." onChange={handleChange} />
        </div>
      <div className="registnavigate">
        <button onClick={() => navigate('/rentalitem')}>뒤로가기</button>
        <button type="submit">등록하기</button>
      </div>
      </form>
    </div>
  );
};

export default PostRegist;
