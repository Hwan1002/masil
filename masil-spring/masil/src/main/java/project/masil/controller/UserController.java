package project.masil.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import project.masil.dto.ResponseDTO;
import project.masil.dto.UserDTO;
import project.masil.service.AuthService;
import project.masil.service.EmailService;
import project.masil.service.UserService;

@RequestMapping("user")
@RestController
public class UserController {

	// 서비스 의존성 주입
	@Autowired
	private UserService service;
	@Autowired
	private EmailService emailService;
	@Autowired
	private AuthService authService ;

	// 마이페이지에서의 유저정보조회 게시판에대한 내용이들어왔을때 수정예정
	@GetMapping("/userInfo")
	public ResponseEntity<?> getInfo(@AuthenticationPrincipal String userId) {
		ResponseDTO response = service.getInfo(userId);
		return ResponseEntity.ok(response);
	}

	// 회원가입 메서드
	@PostMapping(consumes = { "multipart/form-data" }) // body속 데이터의 타입명시
	public ResponseEntity<?> signup(@RequestPart(value = "profilePhoto", required = false) MultipartFile profilePhoto,
			@RequestPart("dto") UserDTO dto) {
		ResponseDTO<String> response = service.signUp(dto, profilePhoto);
		return ResponseEntity.ok(response);
	}

	// 중복체크 메서드
	@GetMapping
	public ResponseEntity<?> isDuplicateId(@RequestParam(value = "userId") String userId) {
		return ResponseEntity.ok(service.isDuplicateId(userId));
	}

	// 로그인 메서드
	@PostMapping("/login")
	public ResponseEntity<?> signin(@RequestBody UserDTO dto, HttpServletResponse response) {

		
		ResponseDTO<String> responseData = service.signin(dto);
		
		// 쿠키 객체생성
		Cookie refreshCookie = new Cookie("refreshToken", responseData.getValue());
		refreshCookie.setHttpOnly(true); // HttpOnly 설정
		refreshCookie.setSecure(false); // HTTPS에서만 전송 (배포 환경에서 필수 true로 변환해주기)
		refreshCookie.setPath("/"); // 쿠키의 경로 설정 (루트 경로)
		refreshCookie.setMaxAge(7 * 24 * 60 * 60); // 유효기간: 7일
		
		// 응답 객체에 쿠키추가
		response.addCookie(refreshCookie);
		
		responseData.setValue("환영합니다.");		
		return ResponseEntity.ok(responseData);
	}

	// 로그아웃 메서드 
	@PostMapping("/logout")
	public ResponseEntity<?> logout(@CookieValue(value = "refreshToken", required = false) String refreshToken,
			HttpServletResponse response) {
		return ResponseEntity.ok(authService.logout(refreshToken , response));
	}
	
	// 회원정보 수정 메서드 
	@PutMapping("/modify")
	public ResponseEntity<?> modify(@AuthenticationPrincipal String userId , 
			@RequestPart(value ="profilePhoto" , required = false) MultipartFile profilePhoto ,
			@RequestPart("dto") UserDTO dto){
		return ResponseEntity.ok(service.modify(userId,profilePhoto,dto)); 
	}
	

	// 이메일 전송 메서드 (회원가입)
	@PostMapping("/send-email")
	public ResponseEntity<?> sendEmail(@RequestBody UserDTO dto) {
		return ResponseEntity.ok(emailService.sendEmail(dto.getEmail()));
	}

	
	// 이메일 전송 메서드 (비밀번호 재설정전 검증로직)
	@PostMapping("/findPassword")
	public ResponseEntity<?> sendResetPassword(@RequestBody UserDTO dto) {
		service.validateEmailExists(dto.getEmail());
		return ResponseEntity.ok(emailService.sendEmail(dto.getEmail()));
	}

	// 인증번호 검증 메서드
	@PostMapping("/verify")
	public ResponseEntity<?> verifyCode(@RequestBody UserDTO dto) {
		return ResponseEntity.ok(emailService.verifyCode(dto.getEmail(), dto.getVerifyCode()));
	}

	// 아이디 찾기 메서드
	@PostMapping("/findUserId")
	public ResponseEntity<?> findId(@RequestBody UserDTO dto) {
		return ResponseEntity.ok(service.findUserId(dto.getEmail()));
	}

	// 비밀번호 재설정 메서드 (이메일 인증번호 요청과 검증후 재설정로직)
	@PutMapping("/ResetPassword")
	public ResponseEntity<?> resetPassword(@RequestBody UserDTO dto) {
		return ResponseEntity.ok(service.resetPassword(dto));
	}

}
