package project.masil.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import project.masil.dto.PostDTO;
import project.masil.dto.ResponseDTO;
import project.masil.service.PostService;

@RequestMapping("post")
@RestController
public class PostController {

	@Autowired
	private PostService service;
	
	
	// 전체 게시물 조회 
	@GetMapping
	public ResponseEntity<?> postRetrieve(){
		return ResponseEntity.ok(service.retrievePost());
	}
	
	// 특정 게시물 조회
	@GetMapping("/item/{postIdx}")
	public ResponseEntity<?> getPostDetail(@AuthenticationPrincipal String userId  ,@PathVariable("postIdx") Integer postIdx) {
		return ResponseEntity.ok(service.postDetail(postIdx)) ;
	}
	
	
	
	// 내 게시물 조회
	@GetMapping("/myPost")
	public ResponseEntity<?> getMyPost(@AuthenticationPrincipal String userId){		
		return ResponseEntity.ok(service.myPost(userId)) ;
	}
	
	
	// 게시물 업로드 
	@PostMapping(value ="/upload", consumes = { "multipart/form-data" })
	public ResponseEntity<?> postUpload(@AuthenticationPrincipal String userId ,
										@RequestPart(value = "dto") PostDTO dto , 
										@RequestPart(value = "postPhoto", required= false) List<MultipartFile> postPhotos){
		 ResponseDTO<String> response = service.upload(userId,dto,postPhotos);
		 return ResponseEntity.ok(response);
	}
	
	
	// 게시물 수정
	@PutMapping(value ="/modify" , consumes = {"multipart/form-data"})
	public  ResponseEntity<?> modifyPost(@AuthenticationPrincipal String userId, 
										@RequestPart(value = "dto") PostDTO dto , 
										@RequestPart(value = "postPhoto", required= false) List<MultipartFile> postPhotos){
		
		ResponseDTO<String> response = service.modify(userId,dto,postPhotos) ;
		
		return ResponseEntity.ok(response) ;
	}
	
	
	// 게시물 삭제 
	@DeleteMapping("/{postIdx}")
	public ResponseEntity<?> deletePost(@AuthenticationPrincipal String userId ,@PathVariable("postIdx") Integer postIdx) {
		return ResponseEntity.ok(service.deletePost(userId , postIdx));
	}

	
	
	
}
