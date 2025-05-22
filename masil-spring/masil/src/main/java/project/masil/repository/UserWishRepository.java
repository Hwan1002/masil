package project.masil.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import project.masil.dto.PostDTO;
import project.masil.entity.PostEntity;
import project.masil.entity.UserEntity;
import project.masil.entity.UserWishEntity;

@Repository
public interface UserWishRepository extends JpaRepository<UserWishEntity, Integer> {

	// user와 post를 통한 wishEntity 조회
	Optional<UserWishEntity> findByUserAndPost(UserEntity user, PostEntity post);

	// post의 찜갯수 조회
	Integer countByPost(PostEntity post);
	
	// 유저의 찜한 게시물 조회
	List<UserWishEntity> findAllByUser (UserEntity user); 
}
