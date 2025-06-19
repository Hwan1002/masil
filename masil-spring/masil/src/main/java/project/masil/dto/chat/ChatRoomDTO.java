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
public class ChatRoomDTO {

    private Long roomId;                // 채팅방 ID
    private String lenderId;            // 빌려주는 사람(게시글 작성자) ID
    private String borrowerId;          // 빌리는 사람(현재 사용자) ID
    private LocalDateTime createdAt;    // 채팅방 생성 시각
    // 필요하다면 추가 필드 (예: 게시글 제목, 참여자 닉네임 등)
	
}
