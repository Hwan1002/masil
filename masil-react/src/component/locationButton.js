import React, { useContext, useState } from "react";
import {ProjectContext } from "../context/MasilContext";
import "../css/LocationButton.css"; //
import axios from "axios";
const LocationButton = () => {
  const [isopen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { location, setLocation } = useContext(ProjectContext);
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
        setLocation({ latitude, longitude });
        setIsOpen(true);
        try {
          // 서버로 위치 데이터 전송
          const response = await axios.post(`http://localhost:9090/location`, {
            lat: latitude,
            lng: longitude,
          });
          console.log(response.data);
          setLocation(response.data);
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

      {isopen && (
        <div className="location-modal-backdrop">
          <div className="location-button-container">
            <p>위도: {location.lat},</p>
            <p>경도: {location.lng}</p>
            <p>주소 : {location.address}</p>
            {error && <p style={{ color: "red" }}>{error}</p>}
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
