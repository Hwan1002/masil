import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api, ProjectContext } from "context/MasilContext";
import useModal from "context/useModal";

export const useMyWishPost = () => {
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

  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addressKeyword, setAddressKeyword] = useState("");

  const itemsPerPage = 15;

  const filteredItems = items.filter((item) => {
    const matchesAddress = (item.address || "")
      .toLowerCase()
      .includes(addressKeyword);
    return matchesAddress;
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
        const response = await Api.get("/wish");
        if (response) setItems(response.data);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };
    fetchData();
  }, []);

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
    currentItems,
    totalPages,
    currentPage,
    goToPage,
    handleItemClick,
  };
};
