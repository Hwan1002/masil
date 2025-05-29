import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Api, ProjectContext } from "../context/MasilContext";
import useModal from "../context/useModal";
import Modal from "../component/Modal";
import "../css/RentalItem.css";

// 내가 찜한 게시물
const MyWishPost = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addressKeyword, setAddressKeyword] = useState("");

  const navigate = useNavigate();
  const { loginSuccess } = useContext(ProjectContext);

  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  const itemsPerPage = 15;

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

  return (
    <div className="flex flex-col p-10 gap-y-5">
      <div>
        <h2 className="flex gap-2 mb-6 text-xl font-bold">
          나의 찜 목록<i className="text-red-500 fas fa-heart"></i>
        </h2>
      </div>
      <div className="gap-8 rental-container">
        {currentItems.map((item) => (
          <a
            href={`/post/item/${item.postIdx}`}
            className="rental-item"
            key={item.postIdx}
            onClick={(e) => handleItemClick(e, item)}
          >
            {item.isSold && <span className="sold-badge">대여 완료</span>}
            <div className="rental-image-wrapper">
              {item.postPhotoPaths && item.postPhotoPaths.length > 0 && (
                <img
                  src={`http://localhost:9090${item.postPhotoPaths[0]}`}
                  alt={item.postTitle}
                  className="rental-image"
                />
              )}
            </div>

            <div className="rental-title">{item.postTitle}</div>
            <div className="rental-price">
              {item.postPrice ? item.postPrice.toLocaleString() : "error"}원
            </div>
            <div className="rental-address">{item.address}</div>
          </a>
        ))}
      </div>
      <div className="pagination-wrapper">
        <div className="pagination">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      </div>

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

export default MyWishPost;
