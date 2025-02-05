package project.masil.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import project.masil.common.FileUploadUtil;
import project.masil.dto.ResponseDTO;
import project.masil.dto.UserDTO;
import project.masil.entity.UserEntity;
import project.masil.repository.UserRepository;

@Service
public class UserService {

	@Autowired // repository 의존성 주입
	private UserRepository userRepository;

	@Autowired // tokenProvider 의존성주입
	private JwtTokenProvider tokenProvider;

	PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	// Id 중복체크 메서드
	// 중복시에 true 반환
	public Boolean isDuplicateId(String userId) {
		return userRepository.existsByUserId(userId);

	}

	// 회원정보 조회 ()
	public ResponseDTO<UserDTO> getInfo(String userId) {
		UserEntity entity = userRepository.findByUserId(userId);
		return ResponseDTO.<UserDTO>builder().status(200).value(toDTO(entity)).build();

	}

	// 회원가입
	public ResponseDTO<String> signUp(UserDTO dto, MultipartFile profilePhoto) {
		// 사진을 저장하고 사진의 경로를 얻는 stirng 반환받은후 그 반환받은 값을 profilePhoto에 직접 넣어준다 .
		if (userRepository.existsByEmail(dto.getEmail())) {
			throw new EmailAlreadyExistsException(dto.getEmail() + " 은(는) 중복된 이메일입니다: ");
		}
		;

		String uploadDir = System.getProperty("user.dir") + "/uploads";
		dto.setProfilePhotoPath("/uploads" +FileUploadUtil.saveFile(profilePhoto, uploadDir, "profilePhotos"));

		dto.setPassword(passwordEncoder.encode(dto.getPassword()));

		userRepository.save(toEntity(dto));
		return ResponseDTO.<String>builder().status(201) // HTTP 상태 코드
				.value("회원가입이 완료되었습니다.") // 성공 메시지
				.build();
	}

	// 로그인
	public ResponseDTO<String> signin(UserDTO dto, HttpServletResponse response) {
		UserEntity user = userRepository.findByUserId(dto.getUserId());
		if (user == null) {
			throw new IdIsNotExistsException("아이디가 일치하지않습니다.");
		}

		if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
			throw new PasswordMismatchException("비밀번호가 일치하지않습니다.");
		}

		String accessToken = tokenProvider.generateAccessToken(user.getUserId());
		String refreshToken = tokenProvider.generateRefreshToken(user.getUserId());

		user.setRefreshToken(refreshToken);
		userRepository.save(user); // DB에 RefreshToken 업데이트

		// 쿠키 객체생성
		Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
		refreshCookie.setHttpOnly(true); // HttpOnly 설정
		refreshCookie.setSecure(false); // HTTPS에서만 전송 (배포 환경에서 필수 true로 변환해주기)
		refreshCookie.setPath("/"); // 쿠키의 경로 설정 (루트 경로)
		refreshCookie.setMaxAge(7 * 24 * 60 * 60); // 유효기간: 7일

		//

		response.addCookie(refreshCookie); // 응답에 쿠키 추가

		return ResponseDTO.<String>builder().status(200).value("환영합니다").accessToken(accessToken).build();

	}

	// 아이디 찾기
	public ResponseDTO<String> findUserId(String email) {
		UserEntity user = userRepository.findByEmail(email);
		if (user == null) {
			throw new EmailIsNotExistsException("이메일이 존재하지않습니다 .");
		}
		return ResponseDTO.<String>builder().status(200).value(user.getUserId()).build();

	}

	// 비밀번호 재설정 전 이메일 검증메서드
	public void validateEmailExists(String email) {
		// repository에 이메일이 없을시 예외처리 .(userService에 있는 예외처리생성자 사용)
		if (!userRepository.existsByEmail(email)) {
			throw new UserService.EmailIsNotExistsException("등록되지 않은 이메일입니다. ");
		}
		;
	}

	// 비밀번호 재설정
	public ResponseDTO<String> resetPassword(UserDTO dto) {
		UserEntity user = userRepository.findByEmail(dto.getEmail());
		user.setPassword(passwordEncoder.encode(dto.getPassword()));
		userRepository.save(user);
		return ResponseDTO.<String>builder().status(200).value("새로운 비밀번호로 로그인해주세요").build();
	}

	// entity -> dto
	public UserDTO toDTO(UserEntity entity) {

		return UserDTO.builder().userId(entity.getUserId()).userName(entity.getUserName())
				.userNickName(entity.getUserNickName()).email(entity.getEmail())
				.profilePhotoPath(entity.getProfilePhotoPath()).location(entity.getLocation())
				.authProvider(entity.getAuthProvider()).build();
	}

	// dto -> entity
	public UserEntity toEntity(UserDTO dto) {
		return UserEntity.builder().userId(dto.getUserId()).password(dto.getPassword()).userName(dto.getUserName())
				.userNickName(dto.getUserNickName()).email(dto.getEmail()).profilePhotoPath(dto.getProfilePhotoPath())
				.location(dto.getLocation()).authProvider(dto.getAuthProvider()).build();
	}

	// 이메일 중복예외 내부클래스
	public static class EmailAlreadyExistsException extends RuntimeException {
		public EmailAlreadyExistsException(String message) {
			super(message);
		}
	}

	// 아이디 불일치 예외 내부클래스
	public static class IdIsNotExistsException extends RuntimeException {
		public IdIsNotExistsException(String message) {
			super(message);
		}
	}

	// 비밀번호 불일치 예외 내부클래스
	public static class PasswordMismatchException extends RuntimeException {
		public PasswordMismatchException(String message) {
			super(message);
		}
	}

	// 이메일 불일치 예외 내부클래스
	public static class EmailIsNotExistsException extends RuntimeException {
		public EmailIsNotExistsException(String message) {
			super(message);
		}
	}

}
