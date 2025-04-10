package project.masil.security;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import project.masil.dto.OAuthAttributes;
import project.masil.dto.ResponseDTO;
import project.masil.service.UserService;
import project.masil.service.UserService.EmailAlreadyExistsException;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

	@Autowired
	private UserService userService;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		try {
			// OAuth2 인증 정보 추출
			OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
			String registrationId = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();
			Map<String, Object> attributes = oAuth2User.getAttributes();

			OAuthAttributes oAuthAttributes = OAuthAttributes.of(registrationId, attributes);

			// 사용자 조회 또는 로그인 및 가입
			ResponseDTO<String> responseData = userService.socialSignin(registrationId, oAuthAttributes, response);

			// 쿠키 객체생성
			Cookie refreshCookie = new Cookie("refreshToken", responseData.getValue());
			refreshCookie.setHttpOnly(true); // HttpOnly 설정
			refreshCookie.setSecure(false); // HTTPS에서만 전송 (배포 환경에서 필수 true로 변환해주기)
			refreshCookie.setPath("/"); // 쿠키의 경로 설정 (루트 경로)
			refreshCookie.setMaxAge(7 * 24 * 60 * 60); // 유효기간: 7일
			response.addCookie(refreshCookie); // 응답에 쿠키 추가
			responseData.setValue("환영합니다.") ;
			
			ObjectMapper objectMapper = new ObjectMapper();

			String script = String
					.format("<script>" + "window.opener.postMessage({ success: %s, data: %s, error: %s }, '%s');"
							+ "window.close();" + "</script>",
					responseData.getStatus() == 200, objectMapper.writeValueAsString(responseData), "null",
					"http://localhost:3000" // 클라이언트 주소
			);

			response.setContentType("text/html;charset=UTF-8");
			response.getWriter().print(script);
		} catch (Exception e) {
			  String errorMessage = (e instanceof EmailAlreadyExistsException) ? 
			            e.getMessage() : "로그인 처리 중 오류가 발생했습니다.";
			//  예외 발생 시 실패 응답 전송
			String script = String
					.format("<script>" + "window.opener.postMessage({ success: false, error: '%s' }, '%s');"
							+ "window.close();" + "</script>", errorMessage, "http://localhost:3000");
			response.setContentType("text/html; charset=UTF-8");
			response.getWriter().print(script);
		}

	}
}
