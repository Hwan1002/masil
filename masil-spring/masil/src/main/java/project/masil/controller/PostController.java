package project.masil.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
	
	@PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> postUpload(
            @RequestPart(value = "postPhoto", required = false) List<MultipartFile> postPhotos,
            @RequestPart("dto") PostDTO dto) {
        
        ResponseDTO<String> response = service.upload(dto, postPhotos);
        return ResponseEntity.ok(response);
    }
}
