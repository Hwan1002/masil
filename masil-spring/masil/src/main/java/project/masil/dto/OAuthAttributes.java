package project.masil.dto;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class OAuthAttributes {
	
	private String userId ;
	private String name ;
	private String email; 
	
	
    public static OAuthAttributes of(String registrationId, Map<String, Object> attributes) {
    	 switch (registrationId.toLowerCase()) {
         case "google":
             return ofGoogle(attributes);
         case "naver":
             return ofNaver(attributes);
         case "kakao":
             return ofKakao(attributes);
         default:
             throw new IllegalArgumentException("Unsupported provider: " + registrationId);
    	 }
    }

    private static OAuthAttributes ofGoogle(Map<String, Object> attributes) {
        return OAuthAttributes.builder()
        		.userId((String) attributes.get("sub"))
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .build();
    }

    @SuppressWarnings("unchecked")
    private static OAuthAttributes ofNaver(Map<String, Object> attributes) {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        return OAuthAttributes.builder()
        		.userId((String) response.get("id"))
                .name((String) response.get("nickname"))
                .email((String) response.get("email"))
                .build();
    }

    @SuppressWarnings("unchecked")
    private static OAuthAttributes ofKakao(Map<String, Object> attributes) {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
        if(kakaoAccount.get("email") == null) {
            throw new IllegalArgumentException("Kakao 이메일 제공 동의가 필요합니다.");
        }
        
        return OAuthAttributes.builder()
        		.userId((String.valueOf (attributes.get("id"))))
                .name((String) kakaoAccount.get("profile"))
                .email((String) kakaoAccount.get("email"))
                .build();
    }
}