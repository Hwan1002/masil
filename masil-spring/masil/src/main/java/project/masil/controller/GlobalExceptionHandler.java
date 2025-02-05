package project.masil.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import project.masil.dto.ResponseDTO;
import project.masil.service.EmailService;
import project.masil.service.UserService;

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
	public ResponseEntity<ResponseDTO<String>>EmailIsNotExistsException(UserService.EmailIsNotExistsException ex) {
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.NOT_FOUND.value())
				.error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}
	
	
	
	// email verificationException (같은 상태코드를 줘도 상관없기때문에 한 예외클래스를 상속받고 모두 같은코드와 각기다른 메세지를 전달할 수 있게 작성 ) 
	@ExceptionHandler(EmailService.VerificationException.class)
	public ResponseEntity<ResponseDTO<String>> handleVerificationException(EmailService.VerificationException ex) {
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.BAD_REQUEST.value()) // 기본 상태 코드
				.error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}
	
	
	
	

}
