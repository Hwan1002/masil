package project.masil.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project.masil.dto.UserWishDTO;
import project.masil.repository.UserWishRepository;
import project.masil.service.UserWishService;

@RestController
@RequestMapping("wish")
public class UserWishController {

	@Autowired 
	private UserWishService userWishService ;
	
	@Autowired
	UserWishRepository userWishRepository;
	
	@PostMapping("/wish/toggle")
	public ResponseEntity<Map<String, Object>> toggleWish(
	        @RequestBody UserWishDTO requestDto,
	        @RequestHeader("user-id") Long userId) {
//	    boolean wished = userWishService.toggleWish(userId, requestDto.getPostId());
//	    long wishCount = userWishRepository.countByPostId(requestDto.getPostId());

	    Map<String, Object> response = new HashMap<>();
//	    response.put("wished", wished);
//	    response.put("wishCount", wishCount);
	    return ResponseEntity.ok(response);
	}
	
	
	
	
	
}
