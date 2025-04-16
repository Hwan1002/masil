package project.masil.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project.masil.service.AuthService;
import project.masil.service.JwtTokenProvider;

@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private AuthService authService; 

	// refreshToken을 통한 access토큰 재발급 메서드
	@PostMapping("/refresh-token")
	public ResponseEntity<?> refreshAccessToken(@CookieValue("refreshToken") String refreshToken) {
		System.out.println("토큰 재발급됐음 ");
		return ResponseEntity.ok(authService.ReissuanceAccessToken(refreshToken));
	}
}
