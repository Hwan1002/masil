package project.masil.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import project.masil.entity.UserEntity;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class PostDTO {

	private Integer postIdx; //게시물 식별자
	
	private LocalDateTime registrationDate; // 게시글 등록날짜 .
	
	private LocalDateTime updateDate ; // 게시글 수정날짜 .
	
	private String postTitle; //게시글 제목

	private Long postPrice; //게시글 제품 렌탈가격
	
	private List<String> postPhotoPaths ; // 게시글사진경로 . 

	private LocalDateTime postStartDate; //제품 빌리는 시작 날짜,시간
	
	private LocalDateTime postEndDate; //제품 빌리는 끝 날짜,시간

	private String description; //제품 설명
		
	private String userNickName ; // 유저닉네임 .

}
