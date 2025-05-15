import React, { useContext, useState } from "react";
import Autocomplete from "react-google-autocomplete";
import "../css/LocationPicker.css"; // CSS 파일 import
import { Api, ProjectContext } from "../context/MasilContext";
import axios from "axios";

const LocationPicker = ( {myPageChange} ) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [latLng, setLatLng] = useState({ lat: null, lng: null });
  const { location, setLocation } = useContext(ProjectContext);

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

  const postPlace = async () => {
    const response = await axios.post(`http://localhost:9090/location`, {
      lat: latLng.lat,
      lng: latLng.lng,
    });
    setLocation(response.data);
    console.log("이값은",response.data);

    myPageChange({
      address: response.data.address,
      lat: response.data.lat,
      lng: response.data.lng,
    });
  };

  return (
    <div>
      <button
        className="location-btn"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        지역 설정
      </button>

      {isOpen && (
        <div
          className="location-modal-backdrop"
          onClick={() => setIsOpen(false)}
        >
          <div className="location-modal" onClick={(e) => e.stopPropagation()}>
            <div
              className="location-close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </div>
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
                {/* <div>
                  <div className="div-selected">
                    <p className="selected-address">
                      {selectedPlace.formatted_address}
                    </p>
                  </div>
                </div> */}
                <div
                  className="location-confirm-btn"
                  onClick={() => {
                    // 서버로 selectedPlace 정보 전송 등 추가 로직
                    postPlace();
                    setIsOpen(false);
                  }}
                >
                  위치 설정 완료
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
