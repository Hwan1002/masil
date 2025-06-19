package project.masil.dto.chat;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChatMessageDTO {
	private Long messageId ; // 메세지 ID
    private String senderId; // 발신자
    private String receiverId; // 수신자 
    private String content; // 메세지 내용
    private LocalDateTime sentAt; // 메세지 전송 시각

}
