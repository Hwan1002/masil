package project.masil.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResponseDTO<T> {

	private int status ; // 상태코드
	private List<T> data ; // 리스트형태의 응답
	private T value ; // 단일응답
	private String error ; // 에러메세지 
	private String accessToken ; // accessToken 
}
