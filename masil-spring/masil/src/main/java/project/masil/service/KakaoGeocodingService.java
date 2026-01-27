package project.masil.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class KakaoGeocodingService {

	@Value("${kakao.rest.api.key}")
	private String kakaoRestApiKey;

	private final String KAKAO_GEO_URL = "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json";

	// 좌표 → 법정동코드 조회
	public String getBcode(Double lat, Double lng) {
		RestTemplate restTemplate = new RestTemplate();
		try {
			// 헤더 설정
			HttpHeaders headers = new HttpHeaders();
			headers.set("Authorization", "KakaoAK " + kakaoRestApiKey);
			HttpEntity<String> entity = new HttpEntity<>(headers);

			// URL 생성
			String url = KAKAO_GEO_URL + "?x=" + lng + "&y=" + lat;

			// API 호출 (헤더 포함)
			ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

			// 응답 처리
			if (response.getStatusCode() == HttpStatus.OK) {
				Map<String, Object> body = response.getBody();
				if (body != null && body.containsKey("documents")) {
					@SuppressWarnings("unchecked")
					List<Map<String, Object>> documents = (List<Map<String, Object>>) body.get("documents");
					if (!documents.isEmpty()) {
						return (String) documents.get(0).get("code");
					}
				}
			}
			return null;
		} catch (RestClientException e) {
			throw new KakaoApiException("카카오 API 호출 실패: " + e.getMessage());
		}

	}

	// kakao API 호출 실패 예외클래스
	public static class KakaoApiException extends RuntimeException {
		public KakaoApiException(String message) {
			super(message);
		}
	}

}