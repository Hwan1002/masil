package project.masil.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import project.masil.dto.PostDTO;
import project.masil.dto.UserWishDTO;
import project.masil.entity.PostEntity;
import project.masil.entity.UserEntity;
import project.masil.entity.UserWishEntity;
import project.masil.repository.PostRepository;
import project.masil.repository.UserRepository;
import project.masil.repository.UserWishRepository;

@Service
public class UserWishService {

	@Autowired
	private UserWishRepository userWishRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private PostRepository postRepository;

	@Transactional
	public UserWishDTO wishPost(String userId, Integer postIdx) {
		UserEntity user = userRepository.findByUserId(userId)
				.orElseThrow(() -> new UserNotFoundException("유저를 찾을 수 없습니다"));

		PostEntity post = postRepository.findById(postIdx)
				.orElseThrow(() -> new PostNotFoundException("게시글을 찾을 수 없습니다 ."));

		// 이미 찜했는지 확인
		if (userWishRepository.findByUserAndPost(user, post).isPresent()) {
			throw new AlreadyWishException("이미 찜한 게시글입니다.");
		}
		;
		UserWishEntity wish = UserWishEntity.builder().user(user).post(post).build();
		userWishRepository.save(wish);

		UserWishDTO dto = new UserWishDTO();
		dto.setPostIdx(postIdx);
		dto.setWished(true);

		return dto;
	}

	@Transactional
	public UserWishDTO unWishPost(String userId, Integer postIdx) {
		UserEntity user = userRepository.findByUserId(userId)
				.orElseThrow(() -> new UserNotFoundException("유저를 찾을 수 없습니다"));

		PostEntity post = postRepository.findById(postIdx)
				.orElseThrow(() -> new PostNotFoundException("게시글을 찾을 수 없습니다 ."));

		UserWishEntity wish = userWishRepository.findByUserAndPost(user, post)
				.orElseThrow(() -> new NotWishedException("찜 기록이 없습니다."));
		userWishRepository.delete(wish);

		UserWishDTO dto = new UserWishDTO();
		dto.setPostIdx(postIdx);
		dto.setWished(false);

		return dto;
	}

	// wishList 조회
	public List<PostDTO> wishList(String userId) {
		UserEntity user = userRepository.findByUserId(userId)
				.orElseThrow(() -> new UserNotFoundException("유저를 찾을 수 없습니다."));

		List<UserWishEntity> wishes = userWishRepository.findAllByUser(user);

		// 찜한 게시글(Post)만 추출해서 DTO로 변환
		return wishes.stream().map(wish -> {
			PostEntity post = wish.getPost();
			int wishCount = userWishRepository.countByPost(post);
			PostDTO dto = PostService.toDTO(post, wishCount);
			return dto;
		}).collect(Collectors.toList());
	}

	// 게시글이 존재하지않을때에 예외처리
	public static class PostNotFoundException extends RuntimeException {
		public PostNotFoundException(String message) {
			super(message);
		}
	}

	// 유저가 존재하지 않을때에 예외처리
	public static class UserNotFoundException extends RuntimeException {
		public UserNotFoundException(String message) {
			super(message);
		}

	}

	// 이미 찜한게시글을 다시 찜 요청을 보낼때의 예외처리
	public static class AlreadyWishException extends RuntimeException {
		public AlreadyWishException(String message) {
			super(message);
		}

	}

	// 찜이 되어있지 않은 게시물에 찜을 눌렀을때의 예외처리
	public static class NotWishedException extends RuntimeException {
		public NotWishedException(String message) {
			super(message);
		}

	}

}
