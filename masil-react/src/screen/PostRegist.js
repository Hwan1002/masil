import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useEditStore from "../shared/useEditStore";
import useModal from "../context/useModal";
import { Api, ProjectContext } from "../context/MasilContext";
import Modal from "../component/Modal";
import RentalDatePicker from "../component/datepicker/DatePicker";
import LocationButton from "../component/LocationButton";
import LocationPicker from "../component/LocationPicker";
import camera from "../css/img/photo/camera.png";
import "../css/PostRegist.css";
import useLoginStore from "../shared/useLoginStore";

const PostRegist = () => {
  // 이미지 관련 상태
  const [selectedImages, setSelectedImages] = useState([]);
  const [commaPrice, setCommaPrice] = useState("");

  // DatePicker 관련 상태
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { location, setLocation } = useContext(ProjectContext);

  const navigate = useNavigate();
  const { isEdit, setEdit } = useEditStore();
  const { idx } = useLoginStore();

  // 폼 데이터 상태
  const [registData, setRegistData] = useState({
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

  // 수정 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    if (isEdit) {
      const fetchPostItem = async () => {
        try {
          const response = await Api.get(`/post/item/${idx}`);
          const data = response.data;

          // 기존 폼 데이터 설정
          setRegistData({
            postTitle: data.postTitle,
            postPrice: data.postPrice,
            postStartDate: new Date(data.postStartDate),
            postEndDate: new Date(data.postEndDate),
            description: data.description,
          });

          // 가격 콤마 처리 (값 가져올 때 콤마가 제거되어 있어서 다시 설정)
          setCommaPrice(Number(data.postPrice).toLocaleString());

          // 날짜 설정
          setStartDate(new Date(data.postStartDate));
          setEndDate(new Date(data.postEndDate));

          // 위치 정보 설정
          setLocation({
            address: data.address,
            lat: data.lat,
            lng: data.lng,
          });

          // 기존 이미지 설정
          if (data.postPhotoPaths && data.postPhotoPaths.length > 0) {
            const imageUrls = data.postPhotoPaths.map(
              (path) => `http://localhost:9090${path}`
            );

            // 이미지 URL을 File 객체로 변환
            const fetchImages = async () => {
              const imageFiles = await Promise.all(
                imageUrls.map(async (url) => {
                  const response = await fetch(url);
                  const blob = await response.blob();
                  return new File([blob], url.split("/").pop(), {
                    type: blob.type,
                  });
                })
              );
              setSelectedImages(imageFiles);
            };

            fetchImages();
          }
        } catch (error) {
          console.error("데이터 요청 실패:", error);
        }
      };
      fetchPostItem();
    }
  }, [isEdit, idx, setLocation]);

  // 게시글 수정 처리
  const handleModify = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      //DTO 데이터를 FormData에 추가
      formData.append(
        "dto",
        new Blob(
          [
            JSON.stringify({
              postIdx: idx,
              postTitle: registData.postTitle,
              postPrice: registData.postPrice || "0",
              postStartDate: startDate.toISOString(),
              postEndDate: endDate.toISOString(),
              description: registData.description,
              address: location.address,
              lat: location.lat,
              lng: location.lng,
            }),
          ],
          { type: "application/json" }
        )
      );

      //이미지 파일 추가해서 같이 보내기
      if (selectedImages.length > 0) {
        selectedImages.forEach((file) => {
          formData.append("postPhoto", file);
        });
      }

      //수정 API 호출
      const response = await Api.put("/post/modify", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        openModal({
          title: "게시글 수정",
          message: "게시글이 성공적으로 수정되었습니다.",
          actions: [
            {
              label: "확인",
              onClick: () => {
                setEdit(false);
                navigate("/rentalitem");
                closeModal();
              },
            },
          ],
        });
      }
    } catch (error) {
      console.error("수정 실패:", error);
      openModal({
        title: "오류",
        message:
          error.response?.data?.message ||
          "게시글 수정 중 오류가 발생했습니다.",
        actions: [{ label: "확인", onClick: closeModal }],
      });
    }
  };

  // 게시글 등록 처리
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // DTO 데이터를 FormData에 추가
      formData.append(
        "dto",
        new Blob(
          [
            JSON.stringify({
              postTitle: registData.postTitle,
              postPrice: registData.postPrice || "0",
              postStartDate: startDate.toISOString(),
              postEndDate: endDate.toISOString(),
              description: registData.description,
              address: location.address,
              lat: location.lat,
              lng: location.lng,
            }),
          ],
          { type: "application/json" }
        )
      );

      // 이미지 파일 추가
      selectedImages.forEach((file) => {
        formData.append("postPhoto", file);
      });

      // 등록 API 호출
      const response = await Api.post("/post/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        openModal({
          title: "게시글 등록",
          message: "게시글이 성공적으로 등록되었습니다.",
          actions: [
            {
              label: "확인",
              onClick: () => {
                navigate("/rentalitem");
                closeModal();
              },
            },
          ],
        });
      }
    } catch (error) {
      console.error("등록 실패:", error);
      openModal({
        title: "오류",
        message:
          error.response?.data?.message ||
          "게시글 등록 중 오류가 발생했습니다.",
        actions: [{ label: "확인", onClick: closeModal }],
      });
    } finally {
      setLocation({});
    }
  };

  //입력 필드 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "postPrice") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setCommaPrice(numericValue ? Number(numericValue).toLocaleString() : "");
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

  //이미지 파일 선택 처리
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    //이미지 개수 제한 체크
    if (selectedImages.length + files.length > 4) {
      alert("최대 4개의 사진만 등록할 수 있습니다.");
      return;
    }

    setSelectedImages((prevImages) => [...prevImages, ...files]);
    e.target.value = "";
  };

  //파일 선택 창 열기
  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  //이미지 삭제 처리
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
        <h2>{isEdit ? "게시글 수정" : "게시글 등록"}</h2>
      </div>
      <form
        onSubmit={isEdit ? handleModify : handleRegister}
        className="postRegist-form"
      >
        <div className="photoContainer">
          <input
            type="file"
            id="fileInput"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <div className="photoUploadBtn">
            {selectedImages.map((file, index) => (
              <div key={index} className="preview-wrapper">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`미리보기 ${index + 1}`}
                  className="preview-image"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="remove-preview"
                >
                  ×
                </button>
              </div>
            ))}
            {selectedImages.length < 4 && (
              <button
                type="button"
                onClick={triggerFileInput}
                className="upload-button"
              >
                <img src={camera} alt="카메라" className="camera-icon" />
                <span>{selectedImages.length}/4</span>
              </button>
            )}
          </div>
        </div>
        <div className="formDiv">
          <div className="postRegist-photo">
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
                  value={registData.postTitle}
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
              </div>
              <div className="div-input">
                <label>설명</label>
                <textarea
                  className="registdescription"
                  name="description"
                  placeholder="등록할 물건의 설명을 작성해주세요."
                  value={registData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="registnavigate">
                <button
                  type="button"
                  onClick={() => {
                    navigate("/rentalitem");
                    setEdit(false);
                  }}
                >
                  뒤로가기
                </button>
                <button type="submit">
                  {isEdit ? "수정하기" : "등록하기"}
                </button>
              </div>
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
