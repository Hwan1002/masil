package project.masil.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {

	private String userId; // 회원아이디 

	private String password; // 비밀번호
	
	private String userName ; // 이름
	
	private String userNickName ; // 유저 닉네임
	
	private String email; // 이메일
	
	private String profilePhotoPath; // 프로필사진
	
	private String location ; //사용자 위치 
	
	private String authProvider ; // 소셜로그인공급자 
	
	private Double lat ; // 위도

	private Double lng ; // 경도 
	
	private String verifyCode ; // 이메일 인증번호 
	
	private String refreshToken ; // refreshToken
	
	
	
	
}
