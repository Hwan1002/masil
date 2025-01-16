package project.masil.service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import project.masil.dto.ResponseDTO;

@Service
public class EmailService {

	@Autowired
	private JavaMailSender mailSender;

	// 인증번호와 유효시간을 저장하는 맵
	private final Map<String, String> verificationCodes = new ConcurrentHashMap<>();
	private final Map<String, Long> expirationTimes = new ConcurrentHashMap<>();

	// 이메일 인증번호 전송 메서드
	public void sendEmail(String to) {
		
		// 인증번호 난수 생성 및 문자열변수에 저장 
		String code = generateVerificationCode();

		// 인증번호와 유효시간 저장 (덮어쓰기 허용)
		verificationCodes.put(to, code);
		expirationTimes.put(to, System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(5)); // 5분 후 만료

		// 이메일 내용 설정
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(to);
		message.setSubject("이메일 인증번호");
		message.setText("Masil 이메일 인증번호: " + code + "\n\n인증번호 유효시간은 5분입니다.");

		// 이메일 전송
		mailSender.send(message);

		// 만료된 데이터 삭제 스케줄러 실행
		scheduleExpirationCleanup(to);
		
		
		
		
	}

	// 인증번호 검증 메서드
public ResponseDTO<String> verifyCode(String email, String code) {
		
		//  이메일인풋태그에 이메일값과 인증번호값을 보냈을때 이메일이 없는 예외 
		if (!verificationCodes.containsKey(email)) {
			throw new VerificationCodeNotFoundException("입력하신 이메일에 대한 인증번호가 없습니다.") ;
		}

		// 유효시간 초과 시 실패 처리 및 데이터 삭제 후 유효시간이 만료되었습니다 예외처리 
		if (System.currentTimeMillis() > expirationTimes.get(email)) {
			verificationCodes.remove(email);
			expirationTimes.remove(email);
			throw new VerificationCodeExpiredException("인증번호 유효시간이 초과되었습니다.") ;
		}

		// 인증번호가 일치여부 판단 
		boolean isValid = verificationCodes.get(email).equals(code);

		// 인증번호 불일치시 예외처리 
		if (!isValid) {
			throw new VerificationCodeMismatchException("인증번호가 일치하지않습니다. ");
		}
		
		// 성공적으로 검증되면 데이터 삭제
		verificationCodes.remove(email);
		expirationTimes.remove(email);
		
		return ResponseDTO.<String>builder().status(200).value("인증에 성공하였습니다.").build();
		
	}

	// 난수 생성 메서드 (6자리)
	private String generateVerificationCode() {
		Random random = new Random();
		int code = 100000 + random.nextInt(900000); // 6자리 난수 생성
		return String.valueOf(code);
	}

	// 만료된 데이터 삭제 스케줄러
	private void scheduleExpirationCleanup(String email) {
		Executors.newSingleThreadScheduledExecutor().schedule(() -> {
			if (System.currentTimeMillis() > expirationTimes.getOrDefault(email, 0L)) {
				verificationCodes.remove(email);
				expirationTimes.remove(email);
			}
		}, 5, TimeUnit.MINUTES); // 5분 후 실행
	}
	
	
	// 백엔드에서 이메일정규식에 대한 처리를 하게된다면 사용할 메서드 
//	private void validateEmailAddress(String email) throws AddressException {
//        if (email == null || email.trim().isEmpty()) {
//            throw new IllegalArgumentException("이메일 주소가 null이거나 비어 있습니다.");
//        }
//
//        // 방법 1: Apache Commons Validator를 사용한 검증
//        EmailValidator validator = EmailValidator.getInstance();
//        if (!validator.isValid(email)) {
//            throw new IllegalArgumentException("잘못된 이메일 형식입니다: " + email);
//        }
//
//        // 방법 2: Javax Mail의 InternetAddress를 사용한 검증
//        InternetAddress emailAddr = new InternetAddress(email);
//        emailAddr.validate(); // 유효하지 않은 경우 AddressException 발생
//    }

	
	
	// 이메일과 인증번호가 일치하지않을때 예외처리  
	public class VerificationException extends RuntimeException {
	    public VerificationException(String message) {
	        super(message);
	    }
	}
	
	
	
	public class VerificationCodeNotFoundException extends  VerificationException {
	    public VerificationCodeNotFoundException(String message) {
	        super(message);
	    }
	}
	
	public class VerificationCodeExpiredException extends VerificationException {
	    public VerificationCodeExpiredException(String message) {
	        super(message);
	    }
	}

	public class VerificationCodeMismatchException extends VerificationException {
	    public VerificationCodeMismatchException(String message) {
	        super(message);
	    }
	}
	
	
	
	
	
	
	
}

	
	
	
	
	
	
	
	
	
	

