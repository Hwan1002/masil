import React, { useState } from 'react';
import Autocomplete from 'react-google-autocomplete';

const LocationPicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handlePlaceSelected = (place) => {
    setSelectedPlace(place);
    // place 객체 안에 geometry.location.lat(), geometry.location.lng() 등 좌표 정보가 있음
    // 필요하다면 서버로 전송 가능
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)} style={{ padding: '10px 20px' }}>
        지역 설정
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              background: '#fff',
              padding: 30,
              borderRadius: 10,
              minWidth: 350,
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3>지역 검색</h3>
            <Autocomplete
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              apiKey={undefined} 
              onPlaceSelected={handlePlaceSelected}
              options={{
                componentRestrictions: { country: 'kr' },
                types: ['(regions)'],
                fields: ['address_components', 'formatted_address', 'geometry']
              }}
              placeholder="주소 검색 (예: 주안동)"
            />
            {selectedPlace && (
              <div style={{ marginTop: 20 }}>
                <div>선택된 주소: {selectedPlace.formatted_address}</div>
                <button
                  style={{
                    marginTop: 15,
                    padding: '10px 20px',
                    background: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    // 서버로 selectedPlace 정보 전송 등 추가 로직
                    setIsOpen(false);
                  }}
                >
                  위치 설정 완료
                </button>
              </div>
            )}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'none',
                border: 'none',
                fontSize: 20,
                cursor: 'pointer'
              }}
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