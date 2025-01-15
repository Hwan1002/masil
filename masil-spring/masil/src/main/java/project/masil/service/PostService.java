package project.masil.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import project.masil.dto.PostDTO;
import project.masil.dto.ResponseDTO;
import project.masil.entity.PostEntity;
import project.masil.repository.PostRepository;

@Service
public class PostService {
	@Autowired
	private PostRepository postRepository;
	
	
	public ResponseDTO<String> upload(PostDTO dto) {
		postRepository.save(toEntity(dto));
		return ResponseDTO.<String>builder().status(201).value("게시물이 등록되었습니다.").build();
	}
	
	// entity -> dto
	public PostDTO toDTO(PostEntity entity) {
	
		return PostDTO.builder().idx(entity.getIdx()).postTitle(entity.getPostTitle()).postPrice(entity.getPostPrice())
				.postStartDate(entity.getPostStartDate()).postEndDate(entity.getPostEndDate()).description(entity.getDescription())
				.build();
	}

	// dto -> entity
	public PostEntity toEntity(PostDTO dto) {
		return PostEntity.builder().idx(dto.getIdx()).postTitle(dto.getPostTitle()).postPrice(dto.getPostPrice())
				.postStartDate(dto.getPostStartDate()).postEndDate(dto.getPostEndDate()).description(dto.getDescription())
				.build();
	}
}
