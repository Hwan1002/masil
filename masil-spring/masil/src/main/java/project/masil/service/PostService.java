package project.masil.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
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
	
	

	
	// 게시글 업로드
	public ResponseDTO<String> upload(String userId,PostDTO dto,List<MultipartFile> postPhotos) {
		UserEntity user = userRepository.findByUserId(userId) ;		
			
		if(postPhotos == null || postPhotos.isEmpty()) {
			throw new NotExistPhotoException("사진을 등록해주세요 .");
		}				
		
		
		String uploadDir = System.getProperty("user.dir") + "/uploads";
		dto.setPostPhotoPaths(FileUploadUtil.saveFiles(postPhotos, uploadDir, "postPhoto"));
		
		PostEntity entity = toEntity(dto) ;
		entity.setUser(user);
		postRepository.save(entity);
		return ResponseDTO.<String>builder().status(201).value("게시물이 등록되었습니다.").build();
	}
	
	
	// 게시글 조회 
	public List<PostDTO>  retrievePost() {	
	    return postRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
	    }
	
	
	// 게시글 수정
	@Transactional
	public ResponseDTO<String> modify(String userId,PostDTO dto,List<MultipartFile> postPhotos) {
		
		PostEntity post = postRepository.findByPostIdx(dto.getPostIdx()) ;
		
		// 기존 사진경로 복사 
		List<String> currentPaths = new ArrayList<>(post.getPostPhotoPaths());
		
		// DTO 경로 Null-safe 처리 (키가 없거나 null인 경우 빈 리스트로 변환)
	    List<String> dtoPaths = dto.getPostPhotoPaths() != null 
	                            ? dto.getPostPhotoPaths() 
	                            : Collections.emptyList();
		
		 // 필수사진 검증 (DTO의 기존사진경로 , 새로운 사진파일 모두 없을경우
		 boolean hasDtoPhotos = !dtoPaths.isEmpty();
		 boolean hasNewPhotos = postPhotos != null && !postPhotos.isEmpty();
		
		// 아무것도 없다면 postPhotos는 필수적으로 첨부되어야한다 .(예외처리를 해야한다 . (하나의 사진이 필수적으로 필요하다라는 예외메세지반환 ))
		if (!hasDtoPhotos && !hasNewPhotos) {
			throw new NotExistPhotoException("사진을 등록해주세요 .");
		}
		
		// 기존삭제 삭제처리 , (dto경로와 현재경로가 다를때)
		//dto.getPostPhotoPath() 와 post.getPostPhotoPaths() 가 다른경우 == 원래있던사진1,2,3중에서 하나 혹은 두개의 사진이 삭제된것이다 .(삭제된사진은 서버디렉토리에서도 삭제해야한다 .)
		if(!currentPaths.equals(dtoPaths)) {
			List<String> pathsToDelete = new ArrayList<>(currentPaths) ;// 123
			pathsToDelete.removeAll(dtoPaths);							//dtoPaths = 312
			FileUploadUtil.deleteFiles(pathsToDelete) ;
			currentPaths = new ArrayList<>(dtoPaths);	
		}
		
		if(hasNewPhotos) {
		String uploadDir = System.getProperty("user.dir") + "/uploads";
		List<String> newPaths = FileUploadUtil.saveFiles(postPhotos, uploadDir, "postPhoto");
        currentPaths.addAll(newPaths); // 기존경로 + 새 경로
		}
	    // 5. 최종 경로 유효성 검증 (사진이 하나 이상 있는지)
	    if (currentPaths.isEmpty()) {
	        throw new NotExistPhotoException("사진을 등록해주세요.");
	    }

		
		post.setPostPhotoPaths(currentPaths);
		post.setPostTitle(dto.getPostTitle());
		post.setDescription(dto.getDescription());
		post.setPostPrice(dto.getPostPrice());
		post.setPostStartDate(dto.getPostStartDate());
		post.setPostEndDate(dto.getPostEndDate());
		postRepository.save(post);
		
		return ResponseDTO.<String>builder().status(201).value("게시물이 수정되었습니다 .").build();
	}
	
	
	// 게시글상세조회
	public PostDTO postDetail(Integer postIdx) {
	return toDTO(postRepository.findByPostIdx(postIdx));
	}
	
	
	@Transactional
	// 게시글 삭제.
	public ResponseDTO<String> deletePost(Integer postIdx){
		FileUploadUtil.deleteFiles(postRepository.findByPostIdx(postIdx).getPostPhotoPaths());
		postRepository.deleteByPostIdx(postIdx);		
		return ResponseDTO.<String>builder().status(200).value("게시글이 성공적으로 삭제되었습니다.").build();
		
	}
	
	
	
	
	// 게시글에 사진이 없는경우 예외처리내부클래스 
	public static class NotExistPhotoException extends RuntimeException {
		public NotExistPhotoException(String message) {
			super(message);
		}
	}
	
	
	// entity -> dto
	public PostDTO toDTO(PostEntity entity) {
	
		return PostDTO.builder()
				.postIdx(entity.getPostIdx())
				.registrationDate(entity.getRegistrationDate())
				.postTitle(entity.getPostTitle())
				.postPrice(entity.getPostPrice())
				.postPhotoPaths(entity.getPostPhotoPaths())
				.postStartDate(entity.getPostStartDate())
				.postEndDate(entity.getPostEndDate())
				.updateDate(entity.getUpdateDate())
				.description(entity.getDescription())
				.userNickName(entity.getUser().getUserNickName())
				.userProfilePhotoPath(entity.getUser().getProfilePhotoPath())				
				.build();
	}

	// dto -> entity
	public PostEntity toEntity(PostDTO dto) {
		return PostEntity.builder()
				.postIdx(dto.getPostIdx())
				.postTitle(dto.getPostTitle())
				.postPrice(dto.getPostPrice())
				.postPhotoPaths(dto.getPostPhotoPaths())
				.postStartDate(dto.getPostStartDate())
				.postEndDate(dto.getPostEndDate())
				.description(dto.getDescription())
				.build();
	}
}
