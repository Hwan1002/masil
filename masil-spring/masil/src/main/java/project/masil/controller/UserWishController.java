package project.masil.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project.masil.dto.PostDTO;
import project.masil.dto.UserWishDTO;
import project.masil.service.UserWishService;

@RestController
@RequestMapping("wish")
public class UserWishController {

	@Autowired 
	private UserWishService userWishService ;
	
	
    // 내 wishList 조회
    @GetMapping
    public ResponseEntity<List<PostDTO>> getMyWishes(@AuthenticationPrincipal String userId) {  
        return ResponseEntity.ok(userWishService.wishList(userId));
    }
	
	// 찜 추가 
    @PostMapping
    public ResponseEntity<?> wishPost (@AuthenticationPrincipal String userId , @RequestBody UserWishDTO dto) {
        return ResponseEntity.ok(userWishService.wishPost(userId ,dto.getPostIdx()));
    }

    // 찜 해제 
    @DeleteMapping("/{postIdx}")
    public ResponseEntity<?> unWishPost (@AuthenticationPrincipal String userId,@PathVariable UserWishDTO dto) {
        return ResponseEntity.ok(userWishService.unWishPost(userId,dto.getPostIdx()));
    }
    

    
	
}
