import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api, ProjectContext } from "context/MasilContext";
import useModal from "context/useModal";
import useEditStore from "shared/useEditStore";
import useLoginStore from "shared/useLoginStore";

export const usePostRegist = () => {
  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  const navigate = useNavigate();
  const { isEdit, setEdit } = useEditStore();
  const { idx } = useLoginStore();
  const { location, setLocation } = useContext(ProjectContext);

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

  const createFormData = () => {
    // 필수 데이터 검증
    if (!location?.address || !location?.lat || !location?.lng) {
      throw new Error("위치 정보를 설정해주세요.");
    }

    if (!registData.postTitle?.trim()) {
      throw new Error("제목을 입력해주세요.");
    }

    if (!registData.description?.trim()) {
      throw new Error("설명을 입력해주세요.");
    }

    const formData = new FormData();
    const dto = {
      ...(isEdit && { postIdx: idx }),
      postTitle: registData.postTitle,
      postPrice: parseInt(registData.postPrice) || 0, // Long 타입으로 변환
      postStartDate: startDate.toISOString(),
      postEndDate: endDate.toISOString(),
      description: registData.description,
      address: location.address,
      lat: location.lat,
      lng: location.lng,
    };

    console.log("전송할 DTO 데이터:", dto);

    formData.append(
      "dto",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );

    selectedImages.forEach((file) => {
      console.log("추가하는 이미지:", file.name);
      formData.append("postPhoto", file);
    });

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

  const handleModify = async (e) => {
    e.preventDefault();
    try {
      const formData = createFormData();

      console.log("게시글 수정 요청 시작");
      const response = await Api.put("/post/modify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("게시글 수정 응답:", response.data);

      if (response.data) {
        showSuccessModal("게시글이 성공적으로 수정되었습니다.", () => {
          setEdit(false);
          navigate("/rentalitem");
        });
      }
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      console.error("에러 응답:", error.response?.data);
      console.error("에러 상태:", error.response?.status);

      // 구체적인 에러 메시지 표시
      if (error.message) {
        openModal({
          title: "수정 실패",
          message: error.message,
          actions: [{ label: "확인", onClick: closeModal }],
        });
      } else {
        showErrorModal(error);
      }
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitFunc = isEdit ? handleModify : handleRegister;
    await submitFunc(e);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const formData = createFormData();

      console.log("게시글 등록 요청 시작");
      const response = await Api.post("/post/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("게시글 등록 응답:", response.data);

      if (response.data) {
        showSuccessModal("게시글이 성공적으로 등록되었습니다.", () => {
          navigate("/rentalitem");
        });
      }
    } catch (error) {
      console.error("게시글 등록 실패:", error);
      console.error("에러 응답:", error.response?.data);
      console.error("에러 상태:", error.response?.status);

      // 구체적인 에러 메시지 표시
      if (error.message) {
        openModal({
          title: "등록 실패",
          message: error.message,
          actions: [{ label: "확인", onClick: closeModal }],
        });
      } else {
        showErrorModal(error);
      }
    } finally {
      setLocation({});
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

  return {
    isEdit,
    setEdit,
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    selectedImages,
    commaPrice,
    startDate,
    endDate,
    registData,
    navigate,
    setStartDate,
    setEndDate,
    closeModal,
    handleSubmit,
    handleChange,
    handleFileChange,
    handleRemoveImage,
  };
};
