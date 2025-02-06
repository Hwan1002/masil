package project.masil.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import project.masil.dto.ResponseDTO;
import project.masil.entity.UserEntity;
import project.masil.repository.UserRepository;

@Service
public class AuthService {

	@Autowired
	private JwtTokenProvider tokenProvider;

	@Autowired
	private UserRepository userRepository ;
	
	
	// refreshToken을 이용하여 accessToken 재발급
	public ResponseDTO<String> ReissuanceAccessToken(String refreshToken) {
	
		// 토큰 유효성 검증
		if(!tokenProvider.validateToken(refreshToken)) {
			throw new InvalidTokenException("refreshToken이 유효하지않습니다 .") ;
		};
	     // refreshToken을 통한 userId추출
        String userId = tokenProvider.getUserIdFromToken(refreshToken);
        
        

        // 데이터베이스에서 사용자 조회 및 토큰 일치 여부 확인
        UserEntity user = userRepository.findByUserId(userId);
        if (user == null || !refreshToken.equals(user.getRefreshToken())) {
            throw new InvalidTokenException("RefreshToken이 유효하지 않습니다.");
        }
        
       return  ResponseDTO.<String>builder().accessToken(tokenProvider.generateAccessToken(userId)).build();
		
	}

	// logout시 RefreshToken 삭제 
	public ResponseDTO<String> logout(String refreshToken , HttpServletResponse response) {
		
		if(refreshToken ==null || refreshToken.isEmpty()) {
			throw new InvalidTokenException("RefreshToken이 유효하지않습니다 .") ;
		};
		
		UserEntity user = userRepository.findByRefreshToken(refreshToken);
		user.setRefreshToken(null);		
		userRepository.save(user) ;
		
		// 클라이언트 쿠키 삭제
		Cookie cookie = new Cookie("refreshToken", null);
		cookie.setHttpOnly(true);
		cookie.setSecure(false); // https 도입후에는 true로 수정 
		cookie.setPath("/");
		cookie.setMaxAge(0); // 쿠키 즉시 만료
		response.addCookie(cookie);

		return ResponseDTO.<String>builder().status(200).value("로그아웃 되었습니다 .").build() ;
	}
	
	
	// 유효하지 않은 토큰 예외처리 
	public static class InvalidTokenException extends RuntimeException {
		public InvalidTokenException(String message) {
			super(message);
		}

	}
}
