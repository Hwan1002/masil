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
        // SecurityContextHolder에서 인증 객체 추출 (기존 HTTP 필터 인증)
        Authentication securityContextAuth = SecurityContextHolder.getContext().getAuthentication();

        // SecurityContextHolder에 인증 객체가 있는 경우
        if (securityContextAuth != null && securityContextAuth.isAuthenticated()) {
            return securityContextAuth::getName; // Principal(인증사용자객체) 반환
        }
		
		
		// SecurityContextHodler 에 인증객체가 없는경우 , 요청 헤더에서 JWT 추출
		String token = extractToken(request);
		// JWT 가 없거나 유효하지않으면 null 반환 (연결 거부 )
		if (token == null || !jwtTokenProivder.validateToken(token)) {
			return null; // 인증실패시 연결 거부 
		}
		
		
		String userId = jwtTokenProivder.getUserIdFromToken(token);
		// 권한부여
		List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));

		// 인증객체 생성
		Authentication authentication = new UsernamePasswordAuthenticationToken(userId, null, authorities);

		// securityContextHolder 에 인증객체 저장 
		SecurityContextHolder.getContext().setAuthentication(authentication);
		
		// 인증사용자 객체반환
		 return authentication::getName;
	}
	
	
	
	// reqeust Header 에서 JWT 추출. 
    private String extractToken(ServerHttpRequest request) {
        List<String> headers = request.getHeaders().get("Authorization");
        if (headers != null && !headers.isEmpty()) {
            String header = headers.get(0);
            if (header.startsWith("Bearer ")) {
                return header.substring(7);
            }
        }
        return null;
    }
	
}
