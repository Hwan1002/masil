package project.masil.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserWishDTO {

	private Integer postIdx ;  // 게시글Idx
	
	private Boolean wished ; // 찜상태
	
	private Integer wishCount ; // 게시글의 짐 갯수 
}
