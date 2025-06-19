package project.masil.controller.chatting;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import project.masil.dto.chat.ChatMessageDTO;
import project.masil.dto.chat.ChatRoomDTO;
import project.masil.dto.chat.ResponseChatDTO;
import project.masil.entity.chatting.ChatMessageEntity;
import project.masil.entity.chatting.ChatRoomEntity;
import project.masil.service.chatting.ChatService;

@RestController
@RequestMapping("chat")
public class ChatController {

	
	@Autowired
	private ChatService chatService ; 
	
	// 채팅방 조회 또는 생성 
	@GetMapping("/chatRoom")
	public ResponseEntity<?> getOrCreateChatRoom(@RequestParam(name ="receiver")String receiverId ,@AuthenticationPrincipal String userId){
		ChatRoomDTO room = chatService.findOrCreateChatRoom(receiverId,userId );
		List<ChatMessageDTO> messages= chatService.findMessagesByRoomId(room.getRoomId()) ;	
		return ResponseEntity.ok(ResponseChatDTO.builder().room(room).messages(messages).build()) ;
	}
	
}
