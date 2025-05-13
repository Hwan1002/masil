import React, { useState } from "react";
import axios from "axios";
import "../css/LocationButton.css";

const LocationButton = ({ onAddressUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({ lat: null, lng: null });

  const handleGetLocation = async () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      setError("브라우저가 위치 정보를 지원하지 않습니다.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setIsOpen(true);

        try {
          const response = await axios.post(`http://localhost:9090/location`, {
            lat: latitude,
            lng: longitude,
          });

          // 주소 추출
          const { address } = response.data;
          onAddressUpdate(address); // 부모에게 전달
        } catch (err) {
          setError("서버 전송 실패: " + err.message);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setError("위치 정보를 가져올 수 없습니다: " + err.message);
        setIsLoading(false);
      }
    );
  };

  return (
    <div>
      <button
        className="btn-location1"
        onClick={handleGetLocation}
        disabled={isLoading}
        type="button"
      >
        {isLoading ? "처리 중..." : "나의 위치"}
      </button>

      {isOpen && (
        <div className="location-modal-backdrop">
          <div className="location-button-container">
            <div className="location-info">
              <p>위도: {location.lat}</p>
              <p>경도: {location.lng}</p>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
            <button type="button" onClick={() => setIsOpen(false)}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationButton;
