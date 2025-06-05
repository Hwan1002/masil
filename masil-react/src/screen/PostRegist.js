import React, { useContext, useEffect, useState, useCallback } from "react";
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

// 이미지 프리뷰 컴포넌트
const ImagePreview = ({ file, onRemove, index }) => (
  <div className="preview-wrapper">
    <img
      src={URL.createObjectURL(file)}
      alt={`미리보기 ${index + 1}`}
      className="preview-image"
    />
    <button
      type="button"
      onClick={() => onRemove(index)}
      className="remove-preview"
    >
      ×
    </button>
  </div>
);

// 이미지 업로드 버튼 컴포넌트
const UploadButton = ({ onClick, imageCount }) => (
  <button type="button" onClick={onClick} className="upload-button">
    <img src={camera} alt="카메라" className="camera-icon" />
    <span>{imageCount}/4</span>
  </button>
);

// 이미지 업로드 섹션 컴포넌트
const ImageUploadSection = ({
  selectedImages,
  onFileChange,
  onRemoveImage,
}) => {
  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div className="photoContainer">
      <input
        type="file"
        id="fileInput"
        multiple
        accept="image/*"
        onChange={onFileChange}
        style={{ display: "none" }}
      />
      <div className="photoUploadBtn">
        {selectedImages.map((file, index) => (
          <ImagePreview
            key={index}
            file={file}
            index={index}
            onRemove={onRemoveImage}
          />
        ))}
        {selectedImages.length < 4 && (
          <UploadButton
            onClick={triggerFileInput}
            imageCount={selectedImages.length}
          />
        )}
      </div>
    </div>
  );
};

// 입력 필드 컴포넌트
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  maxLength,
}) => (
  <div className="div-input">
    <label>{label}</label>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      maxLength={maxLength}
      onChange={onChange}
      value={value}
    />
  </div>
);

const PostRegist = () => {
  const navigate = useNavigate();
  const { isEdit, setEdit } = useEditStore();
  const { idx } = useLoginStore();
  const { location, setLocation } = useContext(ProjectContext);
  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  const [selectedImages, setSelectedImages] = useState([]);
  const [commaPrice, setCommaPrice] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [registData, setRegistData] = useState({
    postTitle: "",
    postPrice: "",
    postStartDate: startDate,
    postEndDate: endDate,
    description: "",
  });

  const loadEditData = useCallback(async () => {
    try {
      const response = await Api.get(`/post/item/${idx}`);
      const data = response.data;

      setRegistData({
        postTitle: data.postTitle,
        postPrice: data.postPrice,
        postStartDate: new Date(data.postStartDate),
        postEndDate: new Date(data.postEndDate),
        description: data.description,
      });

      setCommaPrice(Number(data.postPrice).toLocaleString());
      setStartDate(new Date(data.postStartDate));
      setEndDate(new Date(data.postEndDate));
      setLocation({
        address: data.address,
        lat: data.lat,
        lng: data.lng,
      });

      if (data.postPhotoPaths?.length > 0) {
        loadImages(data.postPhotoPaths);
      }
    } catch (error) {
      console.error("데이터 요청 실패:", error);
    }
  }, [idx, setLocation]);

  useEffect(() => {
    if (isEdit) {
      loadEditData();
    }
  }, [isEdit, loadEditData]);

  // 페이지 이탈 시 수정 모드 초기화
  useEffect(() => {
    return () => {
      if (window.location.pathname !== "/postRegist") {
        setEdit(false);
      }
    };
  }, [setEdit]);

  const loadImages = async (paths) => {
    const imageUrls = paths.map((path) => `http://localhost:9090${path}`);
    try {
      const imageFiles = await Promise.all(
        imageUrls.map(async (url) => {
          const response = await fetch(url);
          const blob = await response.blob();
          return new File([blob], url.split("/").pop(), { type: blob.type });
        })
      );
      setSelectedImages(imageFiles);
    } catch (error) {
      console.error("이미지 로딩 실패:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitFunc = isEdit ? handleModify : handleRegister;
    await submitFunc(e);
  };

  const handleModify = async (e) => {
    e.preventDefault();
    try {
      const formData = createFormData();
      const response = await Api.put("/post/modify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        showSuccessModal("게시글이 성공적으로 수정되었습니다.", () => {
          setEdit(false);
          navigate("/rentalitem");
        });
      }
    } catch (error) {
      showErrorModal(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const formData = createFormData();
      const response = await Api.post("/post/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        showSuccessModal("게시글이 성공적으로 등록되었습니다.", () => {
          navigate("/rentalitem");
        });
      }
    } catch (error) {
      showErrorModal(error);
    } finally {
      setLocation({});
    }
  };

  const createFormData = () => {
    const formData = new FormData();
    const dto = {
      ...(isEdit && { postIdx: idx }),
      postTitle: registData.postTitle,
      postPrice: registData.postPrice || "0",
      postStartDate: startDate.toISOString(),
      postEndDate: endDate.toISOString(),
      description: registData.description,
      address: location.address,
      lat: location.lat,
      lng: location.lng,
    };

    formData.append(
      "dto",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );
    selectedImages.forEach((file) => formData.append("postPhoto", file));
    return formData;
  };

  const showSuccessModal = (message, onConfirm) => {
    openModal({
      title: isEdit ? "게시글 수정" : "게시글 등록",
      message,
      actions: [
        {
          label: "확인",
          onClick: () => {
            onConfirm();
            closeModal();
          },
        },
      ],
    });
  };

  const showErrorModal = (error) => {
    openModal({
      title: "오류",
      message:
        error.response?.data?.message ||
        `게시글 ${isEdit ? "수정" : "등록"} 중 오류가 발생했습니다.`,
      actions: [{ label: "확인", onClick: closeModal }],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "postPrice") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setCommaPrice(numericValue ? Number(numericValue).toLocaleString() : "");
      setRegistData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setRegistData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (selectedImages.length + files.length > 4) {
      alert("최대 4개의 사진만 등록할 수 있습니다.");
      return;
    }
    setSelectedImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove) => {
    openModal({
      message: "선택한 사진을 삭제하시겠습니까?",
      actions: [
        {
          label: "확인",
          onClick: () => {
            setSelectedImages((prev) =>
              prev.filter((_, index) => index !== indexToRemove)
            );
            closeModal();
          },
        },
        { label: "취소", onClick: closeModal },
      ],
    });
  };

  return (
    <div className="postRegist-container">
      <div className="postRegist">
        <div className="postRegist-title">
          <h2>{isEdit ? "게시글 수정" : "게시글 등록"}</h2>
          <span role="img" aria-label="memo" className="title-emoji">
            📋
          </span>
        </div>
        <form onSubmit={handleSubmit}>
          <ImageUploadSection
            selectedImages={selectedImages}
            onFileChange={handleFileChange}
            onRemoveImage={handleRemoveImage}
          />
          <div className="div-grid">
            <div className="postLocation">
              <LocationButton />
              <div className="locationPicker">
                <LocationPicker />
              </div>
            </div>
            <InputField
              label="제목"
              name="postTitle"
              placeholder="게시물 제목"
              maxLength="40"
              value={registData.postTitle}
              onChange={handleChange}
            />

            <InputField
              label="가격"
              name="postPrice"
              placeholder="가격 입력"
              value={commaPrice}
              onChange={handleChange}
            />

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
              <button
                type="submit"
                className={isEdit ? "modify-button" : "register-button"}
              >
                {isEdit ? "수정하기" : "등록하기"}
              </button>
            </div>
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
    </div>
  );
};

export default PostRegist;
