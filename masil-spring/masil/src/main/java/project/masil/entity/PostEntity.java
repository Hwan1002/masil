package project.masil.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@EntityListeners(AuditingEntityListener.class)
public class PostEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer postIdx; // 게시글 식별자 

	@CreatedDate
	private LocalDateTime registrationDate; // 등록날짜 
	
	private String postTitle; //게시글 제목

	private Long postPrice; //게시글 제품 렌탈가격
	
    @ElementCollection
    @CollectionTable(name = "post_photos", joinColumns = @JoinColumn(name = "postIdx"))
    @Column(name = "photoPath")
    private List<String> postPhotoPaths = new ArrayList<>(); // 게시글사진경로 

	private LocalDateTime postStartDate; //제품 빌리는 시작 날짜,시간
	
	private LocalDateTime postEndDate; //제품 빌리는 끝 날짜,시간
	
	@Column(length = 1000)
	private String description; //제품 설명
	
	@LastModifiedDate
	private LocalDateTime updateDate; // 수정날짜 .	

	@ManyToOne
	@JoinColumn(name = "userId" , nullable =false) 
	private UserEntity user ; // 게시글 작성자 정보 , 부모참조 
	
}
