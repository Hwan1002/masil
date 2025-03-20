package project.masil.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import project.masil.common.FileUploadUtil;
import project.masil.dto.PostDTO;
import project.masil.dto.ResponseDTO;
import project.masil.entity.PostEntity;
import project.masil.entity.UserEntity;
import project.masil.repository.PostRepository;
import project.masil.repository.UserRepository;

@Service
public class PostService {
	@Autowired
	private PostRepository postRepository;
	
	@Autowired 
	private UserRepository userRepository;
	
	public ResponseDTO<String> upload(String userId,PostDTO dto,List<MultipartFile> postPhotos) {
		UserEntity user = userRepository.findByUserId(userId) ;
		
		if(postPhotos == null || postPhotos.isEmpty()) {
			throw new notExistPhotoException("사진을 등록해주세요 .");
		}
		String uploadDir = System.getProperty("user.dir") + "/uploads";
		dto.setPostPhotoPaths(FileUploadUtil.saveFiles(postPhotos, uploadDir, "postPhoto"));
		
		PostEntity entity = toEntity(dto) ;
		entity.setUser(user);
		postRepository.save(entity);
		return ResponseDTO.<String>builder().status(201).value("게시물이 등록되었습니다.").build();
	}
	
	
	
	
	// 게시글에 사진이 없는경우 예외처리내부클래스 
	public static class notExistPhotoException extends RuntimeException {
		public notExistPhotoException(String message) {
			super(message);
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// entity -> dto
	public PostDTO toDTO(PostEntity entity) {
	
		return PostDTO.builder().postIdx(entity.getPostIdx()).postTitle(entity.getPostTitle()).postPrice(entity.getPostPrice())
				.postPhotoPaths(entity.getPostPhotoPaths()).postStartDate(entity.getPostStartDate()).postEndDate(entity.getPostEndDate()).description(entity.getDescription())
				.build();
	}

	// dto -> entity
	public PostEntity toEntity(PostDTO dto) {
		return PostEntity.builder().postIdx(dto.getPostIdx()).postTitle(dto.getPostTitle()).postPrice(dto.getPostPrice())
				.postPhotoPaths(dto.getPostPhotoPaths()).postStartDate(dto.getPostStartDate()).postEndDate(dto.getPostEndDate()).description(dto.getDescription())
				.build();
	}
}
