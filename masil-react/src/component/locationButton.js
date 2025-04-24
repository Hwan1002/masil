import React, { useState } from "react";
import axios from "axios";
import { Api } from "../context/MasilContext";

const LocationButton = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGetLocation = () => {
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

        try {
          // 서버로 위치 데이터 전송
          const response = await Api.post("/user/setLocation", {
            lat: latitude,
            lng: longitude,
          });
          console.log(response.data.value);
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
      <button onClick={handleGetLocation} disabled={isLoading}>
        {isLoading ? "처리 중..." : "내 위치 보내기"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {location && (
        <p>
          위도: {location.latitude}, 경도: {location.longitude}
        </p>
      )}
    </div>
  );
};

export default LocationButton;
