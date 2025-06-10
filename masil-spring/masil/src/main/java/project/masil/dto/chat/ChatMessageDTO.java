package project.masil.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChatMessageDTO {
    private String senderId; // 발신자
    private String receiverId; // 수신자 
    private String content;
}
