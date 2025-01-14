package project.masil.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import project.masil.dto.ResponseDTO;
import project.masil.dto.UserDTO;
import project.masil.service.UserService;

@RequestMapping("user")
@RestController
public class UserController {

	// 서비스 의존성 주입 
	@Autowired
	private UserService service ;
	
	// 마이페이지에서의 유저정보조회 게시판에대한 내용이들어왔을때 수정예정 
	@GetMapping("/{userId}") 
	public ResponseEntity<?> signin(@PathVariable("userId")String userId ){
		ResponseDTO response = service.getInfo(userId) ;
		return ResponseEntity.ok(response); 
	}
	
	// 회원가입 메서드 
	@PostMapping(consumes = {"multipart/form-data"}) // body속 데이터의 타입명시 
	public ResponseEntity<?> signup(@RequestPart(value = "profilePhoto" , required =false)  MultipartFile profilePhoto,
									@RequestPart("dto") UserDTO dto) {
		 ResponseDTO<String> response = service.signUp(dto,profilePhoto) ;
		return ResponseEntity.ok(response) ;
	}
	
	
}
