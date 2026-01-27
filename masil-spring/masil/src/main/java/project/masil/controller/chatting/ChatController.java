package project.masil.controller.chatting;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import project.masil.dto.chat.ChatMessageDTO;
import project.masil.dto.chat.ChatRoomDTO;
import project.masil.dto.chat.ResponseChatDTO;
import project.masil.service.chatting.ChatService;

@RestController
@RequestMapping("chatting")
@Slf4j
public class ChatController {

	@Autowired
	private ChatService chatService ; 
	
	// 채팅방 조회 또는 생성 
	@GetMapping("/chatRoom")
	public ResponseEntity<?> getOrCreateChatRoom(@RequestParam(name ="receiver")String receiverId ,@AuthenticationPrincipal String userId){
		log.info("채팅방 조회/생성 요청 - receiverId: {}, userId: {}", receiverId, userId);
		
		try {
			ChatRoomDTO room = chatService.findOrCreateChatRoom(receiverId, userId);
			log.info("채팅방 생성/조회 성공 - roomId: {}", room.getRoomId());
			
			List<ChatMessageDTO> messages = chatService.findMessagesByRoomId(room.getRoomId());
			log.info("메시지 조회 성공 - 메시지 개수: {}", messages.size());
			
			ResponseChatDTO response = ResponseChatDTO.builder().room(room).messages(messages).build();
			log.info("응답 데이터 생성 완료");
			
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("채팅방 조회/생성 실패", e);
			return ResponseEntity.badRequest().body("채팅방 조회/생성에 실패했습니다: " + e.getMessage());
		}
	}
	
	// 사용자의 채팅방 목록 조회 (읽지 않은 메시지 수 포함)
	@GetMapping("/rooms")
	public ResponseEntity<?> getChatRooms(@AuthenticationPrincipal String userId) {
		log.info("채팅방 목록 조회 요청 - userId: {}", userId);
		
		try {
			List<ChatRoomDTO> rooms = chatService.findChatRoomsByUserId(userId);
			log.info("채팅방 목록 조회 성공 - 개수: {}", rooms.size());
			log.info("채팅방 목록: {}", rooms);
			return ResponseEntity.ok(rooms);
		} catch (Exception e) {
			log.error("채팅방 목록 조회 실패", e);
			return ResponseEntity.badRequest().body("채팅방 목록 조회에 실패했습니다: " + e.getMessage());
		}
	}
	
	// 사용자의 전체 읽지 않은 메시지 수 조회
	@GetMapping("/unread-count")
	public ResponseEntity<?> getTotalUnreadCount(@AuthenticationPrincipal String userId) {
		log.info("전체 읽지 않은 메시지 수 조회 요청 - userId: {}", userId);
		
		try {
			Long unreadCount = chatService.getTotalUnreadMessageCount(userId);
			log.info("전체 읽지 않은 메시지 수 조회 성공 - 개수: {}", unreadCount);
			return ResponseEntity.ok(unreadCount);
		} catch (Exception e) {
			log.error("전체 읽지 않은 메시지 수 조회 실패", e);
			return ResponseEntity.badRequest().body("읽지 않은 메시지 수 조회에 실패했습니다: " + e.getMessage());
		}
	}
	
	// 특정 채팅방의 읽지 않은 메시지 수 조회
	@GetMapping("/unread-count/{roomId}")
	public ResponseEntity<?> getUnreadCountByRoom(@PathVariable Long roomId, @AuthenticationPrincipal String userId) {
		log.info("채팅방별 읽지 않은 메시지 수 조회 요청 - roomId: {}, userId: {}", roomId, userId);
		
		try {
			Long unreadCount = chatService.getUnreadMessageCountByRoomId(roomId, userId);
			log.info("채팅방별 읽지 않은 메시지 수 조회 성공 - roomId: {}, 개수: {}", roomId, unreadCount);
			return ResponseEntity.ok(unreadCount);
		} catch (Exception e) {
			log.error("채팅방별 읽지 않은 메시지 수 조회 실패", e);
			return ResponseEntity.badRequest().body("읽지 않은 메시지 수 조회에 실패했습니다: " + e.getMessage());
		}
	}
	
	// 특정 채팅방의 메시지들을 읽음 처리
	@PostMapping("/mark-read/{roomId}")
	public ResponseEntity<?> markMessagesAsRead(@PathVariable Long roomId, @AuthenticationPrincipal String userId) {
		log.info("메시지 읽음 처리 요청 - roomId: {}, userId: {}", roomId, userId);
		
		try {
			chatService.markMessagesAsRead(roomId, userId);
			log.info("메시지 읽음 처리 성공 - roomId: {}, userId: {}", roomId, userId);
			return ResponseEntity.ok("메시지가 읽음 처리되었습니다.");
		} catch (Exception e) {
			log.error("메시지 읽음 처리 실패", e);
			return ResponseEntity.badRequest().body("메시지 읽음 처리에 실패했습니다: " + e.getMessage());
		}
	}
}
