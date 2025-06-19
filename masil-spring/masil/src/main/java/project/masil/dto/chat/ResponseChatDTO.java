package project.masil.dto.chat;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResponseChatDTO {

	private ChatRoomDTO room ;
	private List<ChatMessageDTO> messages ;
}
