import React, { useState } from "react";
import Autocomplete from "react-google-autocomplete";
import "../css/LocationPicker.css"; // CSS 파일 import
import { Api } from "../context/MasilContext";

const LocationPicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [latLng, setLatLng] = useState({ lat: null, lng: null });

  const handlePlaceSelected = (place) => {
    setSelectedPlace(place);
    console.log(place);

    if (place && place.geometry && place.geometry.location) {
      setLatLng({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  const postPlace = () => {
    Api.post(`/user/setLocation`, {
      lat: latLng.lat,
      lng: latLng.lng,
    });
  };

  return (
    <div>
      <button className="location-btn" onClick={() => setIsOpen(true)}>
        지역 설정
      </button>

      {isOpen && (
        <div
          className="location-modal-backdrop"
          onClick={() => setIsOpen(false)}
        >
          <div className="location-modal" onClick={(e) => e.stopPropagation()}>
            <h3>지역 검색</h3>
            <Autocomplete
              className="location-autocomplete"
              apiKey={undefined}
              onPlaceSelected={handlePlaceSelected}
              options={{
                componentRestrictions: { country: "kr" }, // 국가코드 강제 적용
                types: ["(regions)"],
                fields: ["address_components", "formatted_address", "geometry"],
                language: "ko", // 한국어 결과우선
                region: "kr", // 지역 검색 범위설정 .
              }}
              placeholder="주소 검색 (예: 주안동)"
            />
            {selectedPlace && (
              <div className="location-selected">
                <div>선택된 주소: {selectedPlace.formatted_address}</div>
                <button
                  className="location-confirm-btn"
                  onClick={() => {
                    // 서버로 selectedPlace 정보 전송 등 추가 로직
                    postPlace();
                    setIsOpen(false);
                  }}
                >
                  위치 설정 완료
                </button>
              </div>
            )}
            <button
              className="location-close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
