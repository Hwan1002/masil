import { useEffect, useState } from "react";
import { Api } from "context/MasilContext";

export const useMyRental = () => {
  const [items, setItems] = useState([]);
  const [showSoldOnly, setShowSoldOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [addressKeyword, setAddressKeyword] = useState("");

  const itemsPerPage = 15;

  const filteredItems = items?.filter((item) => {
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
        const response = await Api.get(`/post/myPost`);
        if (response) setItems(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    if (name === "sold") {
      setShowSoldOnly(checked);
      setCurrentPage(1);
    }
  };

  const filterAddress = (e) => {
    setAddressKeyword(e.target.value.toLowerCase());
  };

  const goToPage = (pageNum) => {
    setCurrentPage(pageNum);
  };

  return {
    showSoldOnly,
    currentPage,
    totalPages,
    currentItems,
    handleFilterChange,
    filterAddress,
    goToPage,
  };
};
