package project.masil.service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

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
	public boolean verifyCode(String email, String code) {
		// 이메일에 대한 인증번호가 없으면 실패
		if (!verificationCodes.containsKey(email)) {
			return false;
		}

		// 유효시간 초과 시 실패 처리 및 데이터 삭제
		if (System.currentTimeMillis() > expirationTimes.get(email)) {
			verificationCodes.remove(email);
			expirationTimes.remove(email);
			return false;
		}

		// 인증번호가 일치하는지 확인
		boolean isValid = verificationCodes.get(email).equals(code);

		// 성공적으로 검증되면 데이터 삭제
		if (isValid) {
			verificationCodes.remove(email);
			expirationTimes.remove(email);
		}

		return isValid;
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
}
