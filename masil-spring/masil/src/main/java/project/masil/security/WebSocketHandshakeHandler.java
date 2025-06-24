package project.masil.security;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import lombok.extern.slf4j.Slf4j;
import project.masil.service.JwtTokenProvider;

@Component
@Slf4j
public class WebSocketHandshakeHandler extends DefaultHandshakeHandler {

	@Autowired
	private JwtTokenProvider jwtTokenProivder;
	

	
	
	@Override
	protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler,
			Map<String, Object> attributes) {
		
		 log.info("핸드셰이크 핸들러 진입: {}", request.getURI());
		
		String token = extractToken(request);
		log.info("Extracted token: {}", token); // 로그 추가
		// JWT 가 없거나 유효하지않으면 null 반환 (연결 거부 )
		if (token == null || !jwtTokenProivder.validateToken(token)) {
		     log.warn("Token is invalid or missing");
		     log.error("토큰 검증 실패: {}", token);
			return null; // 인증실패시 연결 거부 
		}
		
		
		String userId = jwtTokenProivder.getUserIdFromToken(token);

		// 인증객체 생성
		Authentication authentication = new UsernamePasswordAuthenticationToken(userId, null, List.of(new SimpleGrantedAuthority("ROLE_USER")));

		// securityContextHolder 에 인증객체 저장 
		SecurityContextHolder.getContext().setAuthentication(authentication);
		
		// 인증사용자 객체반환
		 return authentication::getName;
	}
	
	
	
	// reqeust Header 에서 JWT 추출. 
    private String extractToken(ServerHttpRequest request) {
        List<String> headers = request.getHeaders().get("Sec-WebSocket-Protocol");
        if (headers != null && !headers.isEmpty()) {
            String headerValue = headers.get(0);
            System.out.println("Sec-WebSocket-Protocol: " + headerValue); // 로그 추가
            String[] protocols = headerValue.split(",");
      
            // 두 번째 값이 존재하면 반환 (JWT)
            if (protocols.length >= 2) {
                return protocols[1].trim(); // 공백 제거
            }
        }
        log.warn("Invalid Sec-WebSocket-Protocol format");
        return null;
    }
	
}
