package project.masil.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import project.masil.dto.ResponseDTO;
import project.masil.service.UserService;

@RestControllerAdvice
public class GlobalExceptionHandler {
	// EmailAlreadyExistsException 
	@ExceptionHandler(UserService.EmailAlreadyExistsException.class)
	public ResponseEntity<ResponseDTO<String>> handleEmailAlreadyExistsException(UserService.EmailAlreadyExistsException ex) {
		// 에러 응답 생성 및 반환
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.CONFLICT.value()).error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
	}

	
	// IdIsNotExistsException
	@ExceptionHandler(UserService.IdIsNotExistsException.class)
	public ResponseEntity<ResponseDTO<String>> IdIsNotExistsException(UserService.IdIsNotExistsException ex) {

		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.NOT_FOUND.value()).error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}
	
	
	// PasswordMismatchException
	@ExceptionHandler(UserService.PasswordMismatchException.class)
	public ResponseEntity<ResponseDTO<String>> PasswordMismatchException(UserService.PasswordMismatchException ex) {
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.UNAUTHORIZED.value()).error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	}
	
}
