package project.masil.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import project.masil.dto.ResponseDTO;
import project.masil.service.UserService;

@RestControllerAdvice
public class GlobalExceptionHandler {
	// EmailAlreadyExistsException 처리
	@ExceptionHandler(UserService.EmailAlreadyExistsException.class)
	public ResponseEntity<ResponseDTO<String>> handleEmailAlreadyExistsException(UserService.EmailAlreadyExistsException ex) {
		// 에러 응답 생성 및 반환
		ResponseDTO<String> response = ResponseDTO.<String>builder().status(HttpStatus.CONFLICT.value()).error(ex.getMessage()).build();
		return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
	}

}
