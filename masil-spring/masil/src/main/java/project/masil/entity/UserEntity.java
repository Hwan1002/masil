package project.masil.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "users")
@Entity
public class UserEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer idx; // 회원 식별자

	@Column(unique = true , name = "user_id")
	private String userId; // 회원아이디

	private String password; // 비밀번호

	private String userName; // 이름
	
	private String userNickName; // 유저닉네임 

	private String email; // 이메일

	private String profilePhotoPath; // 프로필사진 경로

	private String authProvider; // 소셜로그인공급자
	
	private String refreshToken ; // refreshToken 
	
	private String role ;  // 유저권한 .
	
	private String address; // 주소
	
	private Double lat ; // 위도

	private Double lng ; // 경도 
	
	@OneToMany(mappedBy = "user" , cascade = CascadeType.ALL)
	@Builder.Default
	private List<PostEntity> posts = new ArrayList<>(); // 게시글

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@Builder.Default
	private List<UserWishEntity> wishes = new ArrayList<>(); // 찜한 게시글 목록

	
	
	
}
