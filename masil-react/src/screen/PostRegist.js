import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useModal from "../context/useModal";
import { Api } from "../context/MasilContext";
import RentalDatePicker from "../component/datepicker/DatePicker";
import Modal from "../component/Modal";
import camera from "../css/img/photo/camera.png";
import "../css/PostRegist.css";

const PostRegist = () => {
  const [commaPrice, setCommaPrice] = useState("");
  const [selectedImages, setSelectedImages] = useState([]); // 여러 이미지를 저장하는 배열
  const [imagePreviews, setImagePreviews] = useState([]);
  const [item, setItem] = useState([]);
  //DatePicker 에서 값 받아옴
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const { idx } = useParams();
  const navigate = useNavigate();

  const location = useLocation();

  const editMode = location.state?.editMode || false;
  useEffect(() => {
    const fetchPostItem = async (idx) => {
      if (editMode) {
        try {
          const response = await Api.get(`/post/item/${idx}`);
          console.log(response.data);
          setItem(response.data);
        } catch (error) {
          console.error("데이터 요청 실패:", error);
          return null;
        }
      }
    };
  }, []);

  const [RegistData, setRegistData] = useState({
    postTitle: "",
    postPrice: "",
    postStartDate: startDate,
    postEndDate: endDate,
    description: "",
  });

  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  // 등록하기
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 방지

    const formData = new FormData();

    // DTO 데이터를 FormData에 추가 (JSON 문자열로 변환)
    formData.append(
      "dto",
      new Blob(
        [
          JSON.stringify({
            postTitle: RegistData.postTitle,
            postPrice: RegistData.postPrice,
            postStartDate: startDate.toISOString(),
            postEndDate: endDate.toISOString(),
            description: RegistData.description,
          }),
        ],
        { type: "application/json" }
      )
    );

    // 선택된 파일들을 FormData에 추가 (Blob으로 변환)
    selectedImages.forEach((file) => {
      const blob = new Blob([file], { type: file.type }); // 파일을 Blob으로 변환
      formData.append("postPhoto", blob, file.name); // 'postPhoto'라는 이름으로 파일을 Blob으로 추가
    });

    try {
      const response = await Api.post("/post/upload", formData, {
        // 'Content-Type'은 FormData를 사용할 때 자동으로 설정되므로 명시적으로 설정할 필요 없음
      });

      console.log("파일 업로드 성공:", response.data);
      openModal({
        title: `게시글 등록`,
        message: `게시글이 등록되었습니다.`,
        actions: [
          {
            label: "확인",
            onClick: () => {
              navigate("/rentalitem");
            },
          },
        ],
      });
      // navigate('/rentalitem'); // 성공 시 다른 페이지로 이동
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      openModal({
        message: "렌탈물품의 사진을 등록해주세요.",
      });
    }
  };

  //가격 인풋창 변경상태
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "postPrice") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setCommaPrice(Number(numericValue).toLocaleString());
      setRegistData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setRegistData((prev) => ({
        ...prev,
        [name]: value,
      }));
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
      openModal({
        message: "최대 4개의 사진만 등록할 수 있습니다.",
      });
      return;
    }

    //files.map((file) => URL.createObjectURL(file)); 각 파일을 브라우저에서 미리볼 수 있도록 URL 생성성
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prevImages) => [...prevImages, ...files]);

    // 파일 선택 창 초기화 방지
    e.target.value = "";
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput").click(); // 버튼 클릭 시 파일 선택창 열기
  };

  // 이미지 미리보기 삭제
  const handleRemoveImage = (indexToRemove) => {
    openModal({
      message: "선택한 사진을 삭제하시겠습니까?",
      actions: [
        {
          label: "확인",
          onClick: () => {
            setSelectedImages((prevImages) =>
              prevImages.filter((_, index) => index !== indexToRemove)
            );
            setImagePreviews((prevPreviews) =>
              prevPreviews.filter((_, index) => index !== indexToRemove)
            );
            closeModal();
          },
        },
        { label: "취소", onClick: closeModal },
      ],
    });
  };

  return (
    <div className="postRegist">
      <div className="postRegist-title">
        <h2>게시물 등록</h2>
      </div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="formDiv">
          <div className="photoContainer">
            <div className="photoUploadBtn">
              <div>
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
              </div>
              <label>사진({selectedImages.length}/4)</label>
            </div>
            {/* 선택된 여러 이미지 미리보기 */}
            <div className="imagePreviewContainer">
              {selectedImages.map((image, index) => (
                <div key={index} className="imageWrapper">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`선택된 이미지 ${index + 1}`}
                    className="previewImage"
                  />
                  <button
                    type="button"
                    className="deleteButton"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="div-grid">
            <div className="div-input">
              <label>제목</label>
              <input
                name="postTitle"
                type="text"
                placeholder="게시물 제목"
                maxLength="40"
                onChange={handleChange}
              />
            </div>
            <div className="div-input">
              <label>가격</label>
              <input
                name="postPrice"
                type="text"
                placeholder="가격 입력"
                onChange={handleChange}
                value={commaPrice}
              />
            </div>
            <div className="div-input">
              <RentalDatePicker
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />
              {/* <RentalDatePicker onChange={handleDateChange} /> */}
              {/* <DatePicker /> */}
            </div>
            <div className="div-input">
              <label>설명</label>
              <textarea
                className="registdescription"
                name="description"
                placeholder="등록할 물건의 설명을 작성해주세요."
                onChange={handleChange}
              />
            </div>
            <div className="registnavigate">
              <button onClick={() => navigate("/rentalitem")}>뒤로가기</button>
              <button type="submit">등록하기</button>
            </div>
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={modalTitle}
          content={modalMessage}
          actions={modalActions}
        />
      </form>
    </div>
  );
};

export default PostRegist;
