package project.masil.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import project.masil.common.FileUploadUtil;
import project.masil.dto.PostDTO;
import project.masil.dto.ResponseDTO;
import project.masil.entity.PostEntity;
import project.masil.repository.PostRepository;

@Service
public class PostService {
	@Autowired
	private PostRepository postRepository;
	
	
	public ResponseDTO<String> upload(PostDTO dto, List<MultipartFile> postPhotos) {
	    String uploadDir = System.getProperty("user.dir") + "/post";
	    List<String> savedPaths = new ArrayList<>();

	    for (MultipartFile file : postPhotos) {
	        String filePath = FileUploadUtil.saveFile(file, uploadDir, "postPhotos");
	        savedPaths.add(filePath);
	    }

	    dto.setPostPhotoPath(savedPaths); // 여러 개의 파일 경로를 ","로 연결

	    postRepository.save(toEntity(dto));
	    return ResponseDTO.<String>builder().status(201).value("게시물이 등록되었습니다.").build();
	}
	
	public PostDTO toDTO(PostEntity entity) {
	
		return PostDTO.builder().idx(entity.getIdx()).postTitle(entity.getPostTitle()).postPrice(entity.getPostPrice())
				.postStartDate(entity.getPostStartDate()).postEndDate(entity.getPostEndDate()).description(entity.getDescription())
				.build();
	}

	public PostEntity toEntity(PostDTO dto) {
		return PostEntity.builder().idx(dto.getIdx()).postTitle(dto.getPostTitle()).postPrice(dto.getPostPrice())
				.postStartDate(dto.getPostStartDate()).postEndDate(dto.getPostEndDate()).description(dto.getDescription())
				.build();
	}
}
