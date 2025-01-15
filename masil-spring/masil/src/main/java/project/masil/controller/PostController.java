package project.masil.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project.masil.dto.PostDTO;
import project.masil.dto.ResponseDTO;
import project.masil.service.PostService;

@RequestMapping("post")
@RestController
public class PostController {

	@Autowired
	private PostService service;
	
	@PostMapping("/upload")
	public ResponseEntity<?> postUpload(@RequestBody PostDTO dto){
		 ResponseDTO<String> response = service.upload(dto);
		 return ResponseEntity.ok(response);
	}
}
