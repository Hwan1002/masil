package project.masil.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import project.masil.security.JwtAuthenticationFilter;
import project.masil.security.OAuth2FailureHandler;
import project.masil.security.OAuth2SuccessHandler;

@EnableWebSecurity
@Configuration
public class WebSecurityConfig implements WebMvcConfigurer {

    @Autowired
    private  OAuth2SuccessHandler oAuth2SuccessHandler;
    @Autowired
    private  OAuth2FailureHandler oAuth2FailureHandler;
     

    
    
    
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf().disable().cors().configurationSource(corsConfigurationSource()) // CORS 설정 추가
				.and().authorizeHttpRequests().requestMatchers("/auth/refresh-token","/user/**","/uploads/**","/default/**","/post","/rentalitem/**","/post/**"
					).permitAll()
 // 로그인 및 회원가입 , 사진폴더접근 , 기본사진폴더접근
																										// 엔드포인트 허용
				.anyRequest().authenticated() // 나머지 요청은 인증 필요
				.and().addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class); // JWT 필터
																												// 등록

		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.addAllowedOrigin("http://localhost:3000"); // React 개발 서버 Origin 허용
		configuration.addAllowedOrigin("https://accounts.google.com"); // Google OAuth Origin허용 
		configuration.addAllowedMethod("*"); // 모든 HTTP 메서드 허용 (GET, POST, PUT, DELETE 등)
		configuration.addAllowedHeader("*"); // 모든 헤더 허용
		configuration.setAllowCredentials(true); // 쿠키 및 인증 정보 허용

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
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
