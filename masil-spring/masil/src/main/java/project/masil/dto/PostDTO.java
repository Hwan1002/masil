package project.masil.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class PostDTO {

	private Integer idx; //게시물 식별자
	
	private String postPhotoPath; // 프로필사진
	
	private String postTitle; //게시글 제목

	private String postPrice; //게시글 제품 렌탈가격

	private String postStartDate; //제품 빌리는 시작 날짜,시간
	
	private String postEndDate; //제품 빌리는 끝 날짜,시간

	private String description; //제품 설명

}
