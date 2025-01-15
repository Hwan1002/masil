package project.masil.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "boards")
@Entity
public class PostEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer idx; 

	private String postTitle; //게시글 제목

	private String postPrice; //게시글 제품 렌탈가격

	private String postStartDate; //제품 빌리는 시작 날짜,시간
	
	private String postEndDate; //제품 빌리는 끝 날짜,시간

	private String description; //제품 설명

}
