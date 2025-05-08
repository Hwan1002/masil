import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useEditStore from "../shared/useEditStore";
import useModal from "../context/useModal";
import { Api, ProjectContext } from "../context/MasilContext";
import RentalDatePicker from "../component/datepicker/DatePicker";
import Modal from "../component/Modal";
import camera from "../css/img/photo/camera.png";
import "../css/PostRegist.css";
import LocationButton from "../component/LocationButton";
import LocationPicker from "../component/LocationPicker";

const PostRegist = () => {
  const [item, setItem] = useState({});
  const [selectedImages, setSelectedImages] = useState([]); // 여러 이미지를 저장하는 배열
  const [imagePreviews, setImagePreviews] = useState([]);
  const [commaPrice, setCommaPrice] = useState("");

  //DatePicker 에서 값 받아옴
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { idx } = useParams();
  const { location, setLocation } = useContext(ProjectContext);

  const navigate = useNavigate();
  const { isEdit, userId, setEdit } = useEditStore();

  // useEffect(() => {
  //   const fetchPostItem = async (idx) => {
  //     try {
  //       const response = await Api.get(`/post/item/${idx}`);
  //       setItem(response.data);
  //     } catch (error) {
  //       console.error("데이터 요청 실패:", error);
  //       return null;
  //     }
  //   };
  //   fetchPostItem();
  // }, [isEdit, idx]);

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
    e.preventDefault();

    const formData = new FormData();

    // DTO 데이터를 FormData에 추가 (JSON 문자열로 변환)
    formData.append(
      "dto",
      new Blob(
        [
          JSON.stringify({
            postTitle: RegistData.postTitle,
            postPrice: RegistData.postPrice || "0",
            postStartDate: startDate.toISOString(),
            postEndDate: endDate.toISOString(),
            description: RegistData.description,
            address: location.address,
            lat: location.lat,
            lng: location.lng,
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
        message: isEdit
          ? `게시글이 등록되었습니다.`
          : "게시글이 수정되었습니다.",
        actions: [
          {
            label: "확인",
            onClick: () => {
              setEdit(false);
              navigate("/rentalitem");
            },
          },
        ],
      });
      // navigate('/rentalitem'); // 성공 시 다른 페이지로 이동
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      openModal({
        title: `경고`,
        message: error.response?.data?.error,
      });
    } finally {
      setLocation({}); // 항상 location 초기화
    }
  };

  //가격 인풋창 변경상태
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "postPrice") {
      const numericValue = value.replace(/[^0-9]/g, ""); // 숫자만 추출

      // 포맷된 값 설정 (콤마를 넣은 가격)
      setCommaPrice(numericValue ? Number(numericValue).toLocaleString() : "");

      // 숫자만 저장 (실제 가격 값)
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
    const files = Array.from(e.target.files);

    // selectedImages (이미 선택된 이미지 개수) + 새로 선택한 files 개수가 5가 안 넘는지 확인
    if (selectedImages.length + files.length > 4) {
      alert("최대 4개의 사진만 등록할 수 있습니다.");
      return;
    }

    // 미리보기용 URL로 변환 (서버로 전송하는 것은 파일 객체)
    // const imageUrls = files.map((file) => URL.createObjectURL(file));

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
    openModal({
      message: "선택한 사진을 삭제하시겠습니까?",
      actions: [
        {
          label: "확인",
          onClick: () => {
            // 선택된 이미지에서 삭제할 이미지 제외하고 상태 업데이트
            setSelectedImages((prevImages) =>
              prevImages.filter((_, index) => index !== indexToRemove)
            );

            // 미리보기 이미지 상태에서 삭제할 이미지 제외하고 상태 업데이트
            setImagePreviews((prevPreviews) =>
              prevPreviews.filter((_, index) => index !== indexToRemove)
            );

            // 모달 닫기
            closeModal();
          },
        },
        { label: "취소", onClick: closeModal }, // 취소 버튼 클릭 시 모달 닫기
      ],
    });
  };

  useEffect(() => {
    return () => {
      selectedImages.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [selectedImages]);

  return (
    <div className="postRegist">
      <div className="postRegist-title">
        <h2>{!isEdit ? "게시물 등록" : "게시물 수정"}</h2>
        {/* <h2>게시물 등록</h2> */}
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
            <div className="postLocation">
              <div>
                <LocationButton />
              </div>
              <div>
                <LocationPicker />
              </div>
            </div>
            <div className="div-input">
              <label>제목</label>
              <input
                name="postTitle"
                type="text"
                placeholder="게시물 제목"
                maxLength="40"
                onChange={handleChange}
                value={item.postTitle}
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
              <button
                onClick={() => {
                  navigate("/rentalitem");
                  setEdit(false);
                }}
              >
                뒤로가기
              </button>
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
