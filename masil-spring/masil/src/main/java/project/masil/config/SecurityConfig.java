//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//import project.masil.security.JwtAuthenticationFilter;
//import project.masil.service.JwtTokenProvider;
//
//@Configuration
//public class SecurityConfig {
//
//    private final JwtTokenProvider jwtTokenProvider;
//    private final UserDetailsService userDetailsService;
//
//    public SecurityConfig(JwtTokenProvider jwtTokenProvider, UserDetailsService userDetailsService) {
//        this.jwtTokenProvider = jwtTokenProvider;
//        this.userDetailsService = userDetailsService;
//    }
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http.csrf().disable()
//            .authorizeHttpRequests()
//                .requestMatchers("/login", "/signup").permitAll() // 로그인 및 회원가입은 인증 없이 접근 가능
//                .anyRequest().authenticated() // 나머지 요청은 인증 필요
//            .and()
//            .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider, userDetailsService),
//                    UsernamePasswordAuthenticationFilter.class); // JWT 필터 등록
//
//        return http.build();
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
//        return configuration.getAuthenticationManager();
//    }
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder(); // 비밀번호 암호화용 인코더
//    }
//}
//
