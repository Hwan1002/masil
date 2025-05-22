package project.masil.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;
import project.masil.dto.ResponseDTO;
import project.masil.service.AuthService;
import project.masil.service.EmailService;
import project.masil.service.KakaoGeocodingService;
import project.masil.service.PostService;
import project.masil.service.UserService;
import project.masil.service.UserWishService;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
	// EmailAlreadyExistsException
	@ExceptionHandler(UserService.EmailAlreadyExistsException.class)
	public ResponseEntity<ResponseDTO<String>> handleEmailAlreadyExistsException(
			UserService.EmailAlreadyExistsException ex) {
		// 에러 응답 생성 및 반환
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.CONFLICT.value())
				.error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
	}

	// IdIsNotExistsException
	@ExceptionHandler(UserService.IdIsNotExistsException.class)
	public ResponseEntity<ResponseDTO<String>> IdIsNotExistsException(UserService.IdIsNotExistsException ex) {

		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.NOT_FOUND.value())
				.error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}

	// PasswordMismatchException
	@ExceptionHandler(UserService.PasswordMismatchException.class)
	public ResponseEntity<ResponseDTO<String>> PasswordMismatchException(UserService.PasswordMismatchException ex) {
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.UNAUTHORIZED.value())
				.error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	}

	// EmailIsNotExistsException
	@ExceptionHandler(UserService.EmailIsNotExistsException.class)
	public ResponseEntity<ResponseDTO<String>> EmailIsNotExistsException(UserService.EmailIsNotExistsException ex) {
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.NOT_FOUND.value())
				.error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}

	// email verificationException (같은 상태코드를 줘도 상관없기때문에 한 예외클래스를 상속받고 모두 같은코드와 각기다른
	// 메세지를 전달할 수 있게 작성 )
	@ExceptionHandler(EmailService.VerificationException.class)
	public ResponseEntity<ResponseDTO<String>> handleVerificationException(EmailService.VerificationException ex) {
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.BAD_REQUEST.value())
				.error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}

	// InvalidTokenException (유효하지 않은 토큰 예외처리)
	@ExceptionHandler(AuthService.InvalidTokenException.class)
	public ResponseEntity<ResponseDTO<String>> InvalidTokenException(AuthService.InvalidTokenException ex) {
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.UNAUTHORIZED.value())
				.error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	}

	// notExistPhotoException 게시글 사진이 존재하지않을때의 예외처리
	@ExceptionHandler(PostService.NotExistPhotoException.class)
	public ResponseEntity<ResponseDTO<String>> NotExistPhotoException(PostService.NotExistPhotoException ex) {
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.BAD_REQUEST.value())
				.error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}

	// NotExistLocation 게시글의 위치정보가 존재하지않는경우 예외처리 .
	@ExceptionHandler(PostService.NotExistLocation.class)
	public ResponseEntity<ResponseDTO<String>> NotExistPhotoException(PostService.NotExistLocation ex) {
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.BAD_REQUEST.value())
				.error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}

	// AccessDeniedException 게시글 수정삭제 권한부족 예외처리
	@ExceptionHandler(PostService.AccessDeniedException.class)
	public ResponseEntity<ResponseDTO<String>> AccessDeniedException(PostService.AccessDeniedException ex) {
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.FORBIDDEN.value())
				.error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
	}

	// 좌표 → 법정동코드 변환 실패 예외처리
	@ExceptionHandler(UserService.NoRegionCodeFoundException.class)
	public ResponseEntity<ResponseDTO<String>> NoRegionCodeFoundException(UserService.NoRegionCodeFoundException ex) {
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.BAD_REQUEST.value())
				.error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}

	// 법정동코드 → 주소 변환 실패 예외처리
	@ExceptionHandler(UserService.AddressNotFoundException.class)
	public ResponseEntity<ResponseDTO<String>> AddressNotFoundException(UserService.AddressNotFoundException ex) {
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.NOT_FOUND.value())
				.error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}

	// kakao API 호출실패 예외처리
	@ExceptionHandler(KakaoGeocodingService.KakaoApiException.class)
	public ResponseEntity<ResponseDTO<String>> KakaoApiException(KakaoGeocodingService.KakaoApiException ex) {
		log.error("Kakao API 오류 발생: {}", ex.getMessage());
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.INTERNAL_SERVER_ERROR.value())
				.error("위치설정 서비스에 일시적인 문제가 발생하였습니다 .").build();
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	}

	// 기타 서버 내부 오류 예외처리
	@ExceptionHandler(UserService.InternalServerErrorException.class)
	public ResponseEntity<ResponseDTO<String>> InternalServerErrorException(
			UserService.InternalServerErrorException ex) {
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.INTERNAL_SERVER_ERROR.value())
				.error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	}

	// 게시글 없음 예외 처리
	@ExceptionHandler(UserWishService.PostNotFoundException.class)
	public ResponseEntity<ResponseDTO<String>> handlePostNotFoundException(UserWishService.PostNotFoundException ex) {
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.NOT_FOUND.value())
				.error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}

	// 유저 없음 예외 처리
	@ExceptionHandler(UserWishService.UserNotFoundException.class)
	public ResponseEntity<ResponseDTO<String>> handleUserNotFoundException(UserWishService.UserNotFoundException ex) {
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.NOT_FOUND.value())
				.error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}

	// 이미 찜한 게시글 예외 처리
	@ExceptionHandler(UserWishService.AlreadyWishException.class)
	public ResponseEntity<ResponseDTO<String>> handleAlreadyWishException(UserWishService.AlreadyWishException ex) {
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.CONFLICT.value()) // 409: 중복 상태
				.error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
	}

	// 찜하지 않은 게시글에 찜 해제 요청 예외 처리
	@ExceptionHandler(UserWishService.NotWishedException.class)
	public ResponseEntity<ResponseDTO<String>> handleNotWishedException(UserWishService.NotWishedException ex) {
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.BAD_REQUEST.value()) // 400: 잘못된 요청
				.error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}

}
