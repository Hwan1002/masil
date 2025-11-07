import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api, ProjectContext } from "context/MasilContext";
import useModal from "context/useModal";
import useEditStore from "shared/useEditStore";

export const useRentalItem = () => {
  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  const navigate = useNavigate();

  const { loginSuccess } = useContext(ProjectContext);

  const { setEdit } = useEditStore();

  const [items, setItems] = useState([]);

  const [showSoldOnly, setShowSoldOnly] = useState(false);
  const [showNearOnly, setShowNearOnly] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [addressKeyword, setAddressKeyword] = useState("");

  const itemsPerPage = 15;

  const filteredItems = items.filter((item) => {
    const matchesSold = showSoldOnly ? item.isSold : true;
    const matchesAddress = (item.address || "")
      .toLowerCase()
      .includes(addressKeyword);
    return matchesSold && matchesAddress;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get("/post");
        if (response) setItems(response.data);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = async (event) => {
    const { name, checked } = event.target;
    // 모든 체크박스 상태를 먼저 false로 설정
    setShowSoldOnly(false);
    setShowNearOnly(false);
    setShowAllPosts(false);

    if (name === "sold") {
      setShowSoldOnly(checked);
    } else if (name === "near") {
      setShowNearOnly(checked);
      if (checked) {
        try {
          const response = await Api.get("/post/nearbyPost");
          if (response) setItems(response.data);
          console.log("근처 게시물", response.data);
        } catch (error) {
          console.error("근처 게시물 불러오기 실패:", error);
        }
      } else {
        //체크 해제시 전체 게시물 다시 불러오기
        try {
          const response = await Api.get("/post");
          setShowAllPosts(true);
          if (response) setItems(response.data);
        } catch (error) {
          console.error("데이터 불러오기 실패:", error);
        }
      }
    } else if (name === "All") {
      setShowAllPosts(checked);
      try {
        const response = await Api.get("/post");
        if (response) setItems(response.data);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    }
    setCurrentPage(1);
  };

  const filterAddress = (e) => {
    setAddressKeyword(e.target.value.toLowerCase());
  };

  const goToPage = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handleItemClick = (e, item) => {
    e.preventDefault();
    if (loginSuccess) {
      navigate(`/post/item/${item.postIdx}`);
    } else {
      openModal({
        message: "로그인이 필요한 서비스입니다.",
        actions: [
          {
            label: "확인",
            onClick: () => {
              closeModal();
              navigate("/");
            },
          },
        ],
      });
    }
  };

  return {
    showSoldOnly,
    showNearOnly,
    showAllPosts,
    currentPage,
    totalPages,
    currentItems,
    loginSuccess,
    setEdit,
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    navigate,
    closeModal,
    filterAddress,
    goToPage,
    handleItemClick,
    handleFilterChange,
  };
};
