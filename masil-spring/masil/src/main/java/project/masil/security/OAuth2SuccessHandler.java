package project.masil.security;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
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

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

	@Autowired
	private UserService userService;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {

		// 1. OAuth2 인증 정보 추출
		OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
		String registrationId = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();
		Map<String, Object> attributes = oAuth2User.getAttributes();

		OAuthAttributes oAuthAttributes = OAuthAttributes.of(registrationId, attributes);

		// 2. 사용자 조회 또는 가입
		ResponseDTO<String> responseData = userService.socialSignin(registrationId, oAuthAttributes,response);

		
		
		// 쿠키 객체생성
		Cookie refreshCookie = new Cookie("refreshToken", responseData.getValue());
		
		
		
		refreshCookie.setHttpOnly(true); // HttpOnly 설정
		refreshCookie.setSecure(false); // HTTPS에서만 전송 (배포 환경에서 필수 true로 변환해주기)
		refreshCookie.setPath("/"); // 쿠키의 경로 설정 (루트 경로)
		refreshCookie.setMaxAge(7 * 24 * 60 * 60); // 유효기간: 7일

		response.addCookie(refreshCookie); // 응답에 쿠키 추가		
		response.setContentType("application/json"); 
	    response.setCharacterEncoding("UTF-8");
		
	    responseData.setValue("") ; // refreshToken responseDTO 객체에서 제거 .
	    ObjectMapper objectMapper = new ObjectMapper();
	    String jsonResponse = objectMapper.writeValueAsString(responseData);
	    response.getWriter().write(jsonResponse);
		
		// 5. 프론트엔드로 리다이렉트 (Optional)
//		response.sendRedirect("http://localhost:3000");

	}
}
