package project.masil.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import project.masil.common.FileUploadUtil;
import project.masil.dto.ResponseDTO;
import project.masil.dto.UserDTO;
import project.masil.entity.UserEntity;
import project.masil.repository.UserRepository;

@Service
public class UserService {

	@Autowired // repository 의존성 주입
	private UserRepository userRepository;
	
	PasswordEncoder passwordEncoder =  new BCryptPasswordEncoder() ;
	

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

	// 회원가입 ( 추후 예외처리 로직 추가예정 .)
	// 예외처리 : 이메일 중복일시에 예외
	public ResponseDTO<String> signUp(UserDTO dto, MultipartFile profilePhoto) {
		// 사진을 저장하고 사진의 경로를 얻는 stirng 반환받은후 그 반환받은 값을 profilePhoto에 직접 넣어준다 .
		if (userRepository.existsByEmail(dto.getEmail())) {
			throw new EmailAlreadyExistsException(dto.getEmail() + " 은(는) 중복된 이메일입니다: ");
		}
		;

		String uploadDir = System.getProperty("user.dir") + "/uploads";
		dto.setProfilePhotoPath(FileUploadUtil.saveFile(profilePhoto, uploadDir, "profilePhotos"));
		
		dto.setPassword(passwordEncoder.encode(dto.getPassword()));
		
		userRepository.save(toEntity(dto));
		return ResponseDTO.<String>builder().status(201) // HTTP 상태 코드
				.value("회원가입이 완료되었습니다.") // 성공 메시지
				.build();
	}

	// 로그인
	public ResponseDTO<String> signin(UserDTO dto) {
		UserEntity user = userRepository.findByUserId(dto.getUserId());
		if (user == null) {
			throw new IdIsNotExistsException("아이디가 일치하지않습니다.");
		}
		
		if(!passwordEncoder.matches(dto.getPassword(),user.getPassword())) { 
			throw new PasswordMismatchException("비밀번호가 일치하지않습니다.");
		}
	

		return ResponseDTO.<String>builder().status(200).value("환영합니다").build();

	}

	// entity -> dto
	public UserDTO toDTO(UserEntity entity) {

		return UserDTO.builder().userId(entity.getUserId()).password(entity.getPassword())
				.userName(entity.getUserName()).userNickName(entity.getUserNickName()).email(entity.getEmail())
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

}
