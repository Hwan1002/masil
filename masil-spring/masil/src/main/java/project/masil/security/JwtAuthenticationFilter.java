package project.masil.security;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import project.masil.service.JwtTokenProvider;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

	
	@Autowired
    private  JwtTokenProvider jwtTokenProvider;

	  @Override
	    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
	            throws ServletException, IOException {
	        // 요청에서 JWT를 추출
	        String jwt = resolveToken(request);

	        // JWT가 유효한 경우 인증 정보 설정
	        if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {
	            String userId = jwtTokenProvider.getUserIdFromToken(jwt); // 토큰에서 userId 추출
	            

	            // 인증 객체 생성 및 SecurityContext에 설정(token을 통해 userId만 저장)

	            Authentication authentication =
	                    new UsernamePasswordAuthenticationToken(userId, null);
	            SecurityContextHolder.getContext().setAuthentication(authentication);
	        } 

	        // 다음 필터로 요청 전달
	        filterChain.doFilter(request, response);
	    } 


    // 요청 헤더에서 JWT 토큰 추출
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 이후의 토큰 값 반환
        }
        return null; // 토큰이 없으면 null 반환
    }
}