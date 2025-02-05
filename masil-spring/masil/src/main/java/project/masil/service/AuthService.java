package project.masil.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import project.masil.dto.ResponseDTO;
import project.masil.entity.UserEntity;
import project.masil.repository.UserRepository;

@Service
public class AuthService {

	@Autowired
	private JwtTokenProvider tokenProvider;

	@Autowired
	private UserRepository userRepository ;
	
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
            throw new InvalidTokenException("refreshToken이 유효하지 않습니다.");
        }
        
       return  ResponseDTO.<String>builder().accessToken(tokenProvider.generateAccessToken(userId)).build();
		
	}

	
	
	// 유효하지 않은 토큰 예외처리 
	public static class InvalidTokenException extends RuntimeException {
		public InvalidTokenException(String message) {
			super(message);
		}

	}
}
