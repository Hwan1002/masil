package project.masil.service;

import java.nio.file.Paths;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import project.masil.common.FileUploadUtil;
import project.masil.dto.OAuthAttributes;
import project.masil.dto.ResponseDTO;
import project.masil.dto.UserDTO;
import project.masil.entity.UserEntity;
import project.masil.repository.UserRepository;

@Service
public class UserService {

	// 기본프로필 경로
	public static final String DEFAULT_PROFILE_PHOTO = "/default/userDefault.svg";

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

		if (profilePhoto == null || profilePhoto.isEmpty()) {
			dto.setProfilePhotoPath(DEFAULT_PROFILE_PHOTO);
		} else {
			String uploadDir = System.getProperty("user.dir") + "/uploads";
			dto.setProfilePhotoPath(FileUploadUtil.saveFile(profilePhoto, uploadDir, "profilePhotos"));
		}
		dto.setPassword(passwordEncoder.encode(dto.getPassword()));

		userRepository.save(toEntity(dto));
		return ResponseDTO.<String>builder().status(201) // HTTP 상태 코드
				.value("회원가입이 완료되었습니다.") // 성공 메시지
				.build();
	}

	// 소셜로그인
	public ResponseDTO<String> socialSignin(String authProvider, OAuthAttributes attributes,HttpServletResponse response) {
		// 1 dto에 포함되어있는 이메일 로 entity꺼내오기
		Optional<UserEntity> existingUser = userRepository.findByEmail(attributes.getEmail());

        if (existingUser.isPresent()) {
            UserEntity user = existingUser.get();
         // 1-1 entity가 존재한다면 authProvider 속성이 null인지 아닌지 비교후 null일경우 중복된 이메일입니다 예외처리
            if (user.getAuthProvider() == null) {
			throw new EmailAlreadyExistsException(attributes.getEmail() + " 은(는) 중복된 이메일입니다 .");
			}
        	// 1-2 null이 아닌경우 로그인로직 (accessToken,refreshToken 발급 및 쿠키저장  응답에 쿠키추가 등 밑의 로그인로직 추가 )
		
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
        }else {
        	// 1-3 엔티티가 존재하지 않는경우 회원가입및 로그인로직 .
        	
        	UserEntity user =UserEntity.builder()
        	.authProvider(authProvider)
        	.userName(attributes.getName())
        	.userId(attributes.getUserId())
        	.profilePhotoPath(attributes.getProfileImageUrl())
        	.email(attributes.getEmail()).build() ;
        	
        	
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
    		response.addCookie(refreshCookie); // 응답에 쿠키 추가

    		return ResponseDTO.<String>builder().status(200).value("환영합니다").accessToken(accessToken).build(); 
        	
        }
		
	
		
		
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

	// 회원정보수정
	public ResponseDTO<String> modify(String userId, MultipartFile profilePhoto, UserDTO dto) {
		UserEntity user = userRepository.findByUserId(userId);

		// 기존 프로필사진경로
		String existingPhoto = user.getProfilePhotoPath();

		if (profilePhoto == null || profilePhoto.isEmpty()) {
			user.setProfilePhotoPath(dto.getProfilePhotoPath());
		} else {
			String uploadDir = System.getProperty("user.dir") + "/uploads";
			user.setProfilePhotoPath(FileUploadUtil.saveFile(profilePhoto, uploadDir, "profilePhotos"));
		}
		user.setUserNickName(dto.getUserNickName());

		// 프로필사진 변경시 기존프로필사진 삭제 .
		if (dto.getProfilePhotoPath().equals("default")) { // 기본이미지로 변경시 기존 프로필사진 삭제 및 기본이미지 경로로 업데이트
			user.setProfilePhotoPath(DEFAULT_PROFILE_PHOTO);
			FileUploadUtil.deleteFile(existingPhoto);
		} else if (!existingPhoto.equals(user.getProfilePhotoPath())) {
			FileUploadUtil.deleteFile(existingPhoto);
		}

		userRepository.save(user);

		return ResponseDTO.<String>builder().status(200).value("회원정보가 수정되었습니다 . ").build();

	}

	// 아이디 찾기
	public ResponseDTO<String> findUserId(String email) {
		UserEntity user = userRepository.findByEmail(email).get();
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
		UserEntity user = userRepository.findByEmail(dto.getEmail()).get();
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
