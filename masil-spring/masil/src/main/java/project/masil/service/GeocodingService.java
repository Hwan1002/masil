package project.masil.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.model.AddressComponent;
import com.google.maps.model.AddressComponentType;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.LatLng;

@Service
public class GeocodingService {

	@Autowired
	private GeoApiContext geoApiContext;

	// 좌표 -> 주소변환
	public String reverseGeocodeToAddress(double lat, double lng) {
	    try {
	        GeocodingResult[] results = GeocodingApi.reverseGeocode(geoApiContext, new LatLng(lat, lng))
	                .language("ko")
	                .await();

	        if (results.length == 0) {
	            throw new RuntimeException("주소를 찾을 수 없습니다.");
	        }

	        // 우선순위 타입 목록: 동 → 읍/면 → 구 → 시 → 도
	        List<AddressComponentType> priorityTypes = Arrays.asList(
	            AddressComponentType.SUBLOCALITY_LEVEL_2,  // 동
	            AddressComponentType.SUBLOCALITY_LEVEL_1,  // 읍/면 혹은 구 
	            AddressComponentType.ADMINISTRATIVE_AREA_LEVEL_2, // 구
	            AddressComponentType.LOCALITY,             // 시
	            AddressComponentType.ADMINISTRATIVE_AREA_LEVEL_1  // 도
	        );
	        // 주소 컴포넌트 순회
	        for (AddressComponentType type : priorityTypes) {
	            for (AddressComponent component : results[0].addressComponents) {
	                if (component.types != null && Arrays.asList(component.types).contains(type)) {
	                    return component.longName;
	                }
	            }
	        }

	        return "주소 정보 없음";

	    } catch (Exception e) {
	        throw new RuntimeException("역지오코딩 실패: " + e.getMessage());
	    }
	}

}
