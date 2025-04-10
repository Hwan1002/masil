import React, { useState, useContext } from "react";
import { ProjectContext } from '../context/MasilContext';
import '../css/PostRegist.css';
import camera from '../css/img/photo/camera.png';
import DatePicker from "../component/DatePicker";
import { useNavigate } from "react-router-dom";
import { Api } from "../context/MasilContext";
import useModal from '../context/useModal';
import Modal from '../component/Modal';
import axios from "axios";

const PostRegist = () => {
  const navigate = useNavigate();
  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();
  const { accessToken } = useContext(ProjectContext);
  const [title, setTitle] = useState(''); // 제목 상태 초기화
  const [price, setPrice] = useState(""); // 가격 상태 초기화
  const [description, setDescription] = useState(''); // 설명 상태 초기화
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가
  const [selectedImages, setSelectedImages] = useState([]); // 여러 이미지를 저장하는 배열

  //DatePicker 에서 값 받아옴
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // 등록하기
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 방지
  
    const formData = new FormData();
  
    // DTO 데이터를 FormData에 추가 (JSON 문자열로 변환)
    formData.append('dto', new Blob([JSON.stringify({
      postTitle: title,
      postPrice: price,
      postStartDate: startDate.toISOString(),
      postEndDate: endDate.toISOString(),
      description: description
    })], { type: "application/json" }));
  
    // 선택된 파일들을 FormData에 추가 (Blob으로 변환)
    selectedImages.forEach((file) => {
      const blob = new Blob([file], { type: file.type }); // 파일을 Blob으로 변환
      formData.append('postPhoto', blob, file.name); // 'postPhoto'라는 이름으로 파일을 Blob으로 추가
    });
  
    try {
      const response = await Api.post('/post/upload', formData, {
        // 'Content-Type'은 FormData를 사용할 때 자동으로 설정되므로 명시적으로 설정할 필요 없음
      });
  
      console.log('파일 업로드 성공:', response.data);
      openModal({
        title: `게시글 등록`,
        message: `게시글이 등록되었습니다.`,
        actions: [{
          label: "확인", onClick: () => {
            // closeModal(); window.location.assign("/rentalitem");
            window.location.reload();
          }
        }]
      });
      // navigate('/rentalitem'); // 성공 시 다른 페이지로 이동
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      openModal({
        title: `경고`,
        message: error.response?.data?.error
      });
      setErrorMessage("파일 업로드에 실패했습니다.");
    }
  };

  // 가격 인풋창 변경 상태
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
    const files = Array.from(e.target.files);
  
    // selectedImages (이미 선택된 이미지 개수) + 새로 선택한 files 개수가 5가 안 넘는지 확인
    if (selectedImages.length + files.length > 4) {
      alert("최대 4개의 사진만 등록할 수 있습니다.");
      return;
    }
  
    // 미리보기용 URL로 변환 (서버로 전송하는 것은 파일 객체)
    const imageUrls = files.map((file) => URL.createObjectURL(file));
  
    // 선택된 이미지들을 상태에 추가 (URL이 아니라 실제 파일 객체만 저장)
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  
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
      return; // 취소 시 함수 종료
    }
  
    setSelectedImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  return (
    <div className="postRegist">
      <h2>게시물 등록</h2>
      {errorMessage && <div className="registerror">{errorMessage}</div>}
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="formDiv">
          <label>사진({selectedImages.length}/4)</label>
          <div className="photoContainer">
            <button type="button" className="registPhoto" onClick={triggerFileInput}>
              <img src={camera} alt="사진 등록" />
            </button>
            <input
              id="fileInput"
              name="profilePhoto"
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange} // 파일 선택 시 호출
            />

            {/* 선택된 여러 이미지 미리보기 */}
            <div className="imagePreviewContainer">
              {selectedImages.map((image, index) => (
                <div key={index} className="imageWrapper">
                  <img src={URL.createObjectURL(image)} alt={`선택된 이미지 ${index + 1}`} className="previewImage" />
                  <button className="deleteButton" onClick={() => handleRemoveImage(index)}>✖</button>
                </div>
              ))}
            </div>
          </div>

          <label>제목</label>
          <input name="postTitle" type="text" placeholder="게시물 제목" maxLength="40" onChange={handleTitleChange} />
          <label>가격</label>
          <input
            name="postPrice"
            type="text"
            placeholder="가격 입력"
            onChange={handleChange}
            value={price}
            maxLength="12"
          />
        </div>
        <div className="formDiv">
          <DatePicker />
        </div>
        <div className="formDiv">
          <label>설명</label>
          <textarea
            className="registdescription"
            name="description"
            placeholder="등록할 물건의 설명을 작성해주세요."
            onChange={handleDescriptionChange}
          />
        </div>
        <div className="registnavigate">
          <button onClick={() => navigate('/rentalitem')}>뒤로가기</button>
          <button type="submit">등록하기</button>
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
  );
};

export default PostRegist;
