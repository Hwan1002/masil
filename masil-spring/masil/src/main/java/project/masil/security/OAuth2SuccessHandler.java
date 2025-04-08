package project.masil.security;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;


import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import project.masil.dto.OAuthAttributes;
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
		userService.socialSignin(registrationId, oAuthAttributes,response);

		// 5. 프론트엔드로 리다이렉트 (Optional)
		response.sendRedirect("http://localhost:3000/login-success");

	}
}
