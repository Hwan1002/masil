package project.masil.service;

import java.util.List;

import javax.management.RuntimeErrorException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
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

	// Id 중복체크 메서드
	// 중복시에 true 반환
	public boolean isDuplicateId(String userId) {
		return userRepository.existsByUserId(userId);

	}

	// 회원정보 조회 ()
	public  ResponseDTO<UserDTO> getInfo(String userId) {
		UserEntity entity =userRepository.findById(userId).orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다 .")) ;
		return ResponseDTO.<UserDTO>builder()
				.status(200).value(toDTO(entity)).build();
		
	}
	
	
	// 회원가입 ( 추후 예외처리 로직 추가예정 .) 
	// 예외처리 : 이메일 중복일시에 예외 
	public ResponseDTO<String> signUp(UserDTO dto, MultipartFile profilePhoto) {
		// 사진을 저장하고 사진의 경로를 얻는 stirng 반환받은후 그 반환받은 값을 profilePhoto에 직접 넣어준다 .
		if(userRepository.existsByEmail(dto.getEmail())) {
			throw new  EmailAlreadyExistsException (dto.getEmail() +" 은(는) 중복된 이메일입니다: ");
		}; 
		
		String uploadDir = System.getProperty("user.dir") + "/uploads";
		dto.setProfilePhotoPath(FileUploadUtil.saveFile(profilePhoto, uploadDir, "profilePhotos"));
		userRepository.save(toEntity(dto));
		return ResponseDTO.<String>builder().status(201) // HTTP 상태 코드
				.value("회원가입이 완료되었습니다.") // 성공 메시지
				.build();
	}
	
	
	
	
	
	
	
	

	// entity -> dto
	public UserDTO toDTO(UserEntity entity) {

		return UserDTO.builder().userId(entity.getUserId()).password(entity.getPassword()).userName(entity.getUserName())
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
	
	
}
