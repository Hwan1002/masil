package project.masil.service;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    
    // 이메일 인증번호 전송 메서드 
    public void sendEmail(String to) {
        SimpleMailMessage message = new SimpleMailMessage();
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        String.valueOf(code);
        message.setTo(to);
        message.setSubject(" 이메일 인증번호 ");
        message.setText("Masil 이메일 인증번호 : "+ String.valueOf(code) +"\n\n 인증번호 유효시간은 5분입니다 .");
        mailSender.send(message);
    }
    
   

   
    
    
    
}