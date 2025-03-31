package project.masil.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.servlet.http.HttpServletResponse;
import project.masil.security.JwtAuthenticationFilter;

@Configuration
public class WebSecurityConfig implements WebMvcConfigurer {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf().disable()
		.cors().configurationSource(corsConfigurationSource()) // CORS 설정 추가
		.and()
		.authorizeHttpRequests(authz -> authz.requestMatchers(
				"/post",
				"/post/item/**",
				"/user", // 회원가입, 중복 체크
		        "/user/login",
		        "/user/send-email",
		        "/user/findPassword",
		        "/user/verify",
		        "/user/findUserId",
		        "/user/ResetPassword",
				"/auth/refresh-token",
				"/uploads/**",
				"/default/**"
				,"/error" // 에러페이지 및 공통경로 
						).permitAll() // 비로그인 유저서비스 , 사진폴더접근 , 정적 리소스 접근 허용
				.anyRequest().authenticated()// 나머지 요청은 인증 필요
				)
				.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class); // JWT 필터등록 
		
		
		return http.build();
	}

	
	
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		configuration.addAllowedOrigin("http://localhost:3000"); // React 개발 서버 Origin 허용
		configuration.addAllowedMethod("*"); // 모든 HTTP 메서드 허용 (GET, POST, PUT, DELETE 등)
		configuration.addAllowedHeader("*"); // 모든 헤더 허용
		configuration.setAllowCredentials(true); // 쿠키 및 인증 정보 허용
		source.registerCorsConfiguration("/**", configuration); // 모든 경로에 대해 CORS 설정 적용
		return source;
	}

	@Bean
	public JwtAuthenticationFilter jwtAuthenticationFilter() {
		return new JwtAuthenticationFilter();
	}

	
	// 실제 파일이 저장된 디렉토리 경로지정 , 
	// 지정된 파일시스템 디렉토리에서 정적리소스 제공하도록 매핑 .
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/uploads/**")
				.addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/");

		// 기본이미지 경로매핑
		 registry.addResourceHandler("/default/**")
         .addResourceLocations("classpath:/static/default/");
	}

	
    @Bean
    public MultipartResolver multipartResolver() {
        return new StandardServletMultipartResolver();
    }
	
}
