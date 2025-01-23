package project.masil.service;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

// 미완성 아직 수정해야할 부분 많음 
@Service
public class JwtTokenProvider {

    private final Key secretKey;

    // Access Token 유효기간 (15분)
    private final long accessTokenValidityInMilliseconds = 1000 * 60 * 15;

    // Refresh Token 유효기간 (7일)
    private final long refreshTokenValidityInMilliseconds = 1000 * 60 * 60 * 24 * 7;

    // properties에 secret을통해 key객체로 변환
    public JwtTokenProvider(@Value("${jwt.secret}") String secret) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Access Token 생성
    public String generateAccessToken(String userId) {
        return generateToken(userId,accessTokenValidityInMilliseconds);
    }

    // Refresh Token 생성
    public String generateRefreshToken(String userId) {
        return generateToken(userId,refreshTokenValidityInMilliseconds);
    }

    // 공통적인 토큰 생성 로직
    private String generateToken(String userId,long validityInMilliseconds) {
        Claims claims = Jwts.claims().setSubject(userId);

        
        
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false; // 유효하지 않은 토큰
        }
    }

    // 토큰에서 사용자 ID 추출
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                            .setSigningKey(secretKey)
                            .build()
                            .parseClaimsJws(token)
                            .getBody();
        return claims.getSubject(); // subject에 userId 반환 
    }
}
