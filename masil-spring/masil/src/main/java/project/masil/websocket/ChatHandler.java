package project.masil.websocket;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.SubProtocolCapable;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import project.masil.dto.chat.ChatMessageDTO;
import project.masil.dto.chat.ChatRoomDTO;
import project.masil.entity.chatting.ChatMessageEntity;
import project.masil.service.chatting.ChatService;

@Component
public class ChatHandler extends AbstractWebSocketHandler  implements SubProtocolCapable {
    
	@Override
    public List<String> getSubProtocols() {
        return List.of("chat-v1"); // 지원하는 서브프로토콜 반환
    }
	
	@Autowired
	private ChatService chatService ;
	
	
	
	private final Map<Long, Set<WebSocketSession>> chatRoomSessions = new ConcurrentHashMap<>();

	private final ObjectMapper objectMapper;
	
	// 생성자에서 ObjectMapper 초기화 및 JavaTimeModule 등록
	public ChatHandler() {
		this.objectMapper = new ObjectMapper();
		this.objectMapper.registerModule(new JavaTimeModule());
	}
	
	 @Override
	    public void afterConnectionEstablished(WebSocketSession session) {
	        // 연결 시점에는 아직 채팅방 정보를 알 수 없으므로, 핸드셰이크 또는 첫 메시지에서 채팅방에 세션 추가
	        System.out.println("새 연결: " + session.getId());
	    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            // 발신자 추출(빌리는사람)
            String senderId = session.getPrincipal().getName();
            
            // 1. 메시지 파싱 (Json -> DTO 변환)
            String payload = message.getPayload();
            Map<String, Object> payloadMap = objectMapper.readValue(payload, Map.class);
            
            // 채팅방 진입 신호인지 확인 (type이 "join"인 경우만)
            String messageType = (String) payloadMap.get("type");
            String content = (String) payloadMap.get("content");
            String receiverId = (String) payloadMap.get("receiverId");
            
            // 채팅방 진입만 하는 경우 (세션 등록만) - type이 "join"인 경우만 처리
            if ("join".equals(messageType)) {
                if (receiverId != null && !receiverId.isEmpty()) {
                    ChatRoomDTO chatRoom = chatService.findOrCreateChatRoom(senderId, receiverId);
                    Set<WebSocketSession> sessions = chatRoomSessions.computeIfAbsent(
                        chatRoom.getRoomId(),
                        k -> new CopyOnWriteArraySet<>()
                    );
                    // 이미 등록된 세션인지 확인
                    boolean alreadyAdded = sessions.contains(session);
                    sessions.add(session);
                    System.out.println("채팅방 진입 - 세션 등록: roomId=" + chatRoom.getRoomId() + ", senderId=" + senderId + ", 세션ID=" + session.getId() + ", 이미등록됨=" + alreadyAdded + ", 현재총세션수=" + sessions.size());
                    
                    // 등록된 모든 세션 확인
                    System.out.println("현재 채팅방에 등록된 세션:");
                    for (WebSocketSession s : sessions) {
                        System.out.println("  - 세션 ID: " + s.getId() + ", 열림: " + s.isOpen() + ", 사용자: " + (s.getPrincipal() != null ? s.getPrincipal().getName() : "null"));
                    }
                }
                return; // 메시지 저장하지 않고 세션만 등록 후 종료
            }
            
            // 일반 메시지 처리 - content가 비어있으면 무시
            if (content == null || content.trim().isEmpty()) {
                System.out.println("빈 메시지 무시: senderId=" + senderId);
                return;
            }
            
            ChatMessageDTO dto = objectMapper.readValue(payload, ChatMessageDTO.class);
            dto.setSenderId(senderId);
        
        // 2. 채팅방 조회 / 생성  
        ChatRoomDTO chatRoom = chatService.findOrCreateChatRoom(dto.getSenderId(), dto.getReceiverId());

        // 3. 채팅방에 세션 추가 (첫 메시지 기준으로 채팅방 연결)
        Set<WebSocketSession> sessions = chatRoomSessions.computeIfAbsent(
            chatRoom.getRoomId(),
            k -> new CopyOnWriteArraySet<>()
        );
        sessions.add(session);
        
        // 4. 채팅메세지 저장
        ChatMessageEntity chatMessage = chatService.saveMessage(chatRoom, dto) ;
        
        // 5. Entity를 DTO로 변환 (순환 참조 및 LocalDateTime 직렬화 문제 방지)
        ChatMessageDTO messageDTO = chatService.messageEntityToDTO(chatMessage);
        
        System.out.println("채팅방 세션 수: " + sessions.size());
        System.out.println("현재 세션 ID: " + session.getId());
        System.out.println("세션 목록:");
        for (WebSocketSession s : sessions) {
            System.out.println("  - 세션 ID: " + s.getId() + ", 열림: " + s.isOpen() + ", 사용자: " + (s.getPrincipal() != null ? s.getPrincipal().getName() : "null"));
        }
        
        // 6. 해당 채팅방에 연결된 모든 세션에 메시지 브로드캐스트
        // 본인에게도 보내서 낙관적 업데이트 메시지를 실제 메시지로 교체할 수 있도록 함
        int sentCount = 0;
        String messageJson = objectMapper.writeValueAsString(messageDTO);
        System.out.println("브로드캐스트할 메시지: " + messageJson);
        
        for (WebSocketSession s : sessions) {
            if (s.isOpen()) {
                try {
                    s.sendMessage(new TextMessage(messageJson));
                    sentCount++;
                    System.out.println("메시지 전송 성공 - 세션 ID: " + s.getId() + ", 사용자: " + (s.getPrincipal() != null ? s.getPrincipal().getName() : "null") + ", 본인여부: " + s.equals(session));
                } catch (Exception e) {
                    System.err.println("메시지 전송 실패 - 세션 ID: " + s.getId() + ", 오류: " + e.getMessage());
                }
            } else {
                System.out.println("메시지 전송 건너뜀 - 세션 ID: " + s.getId() + ", 열림: " + s.isOpen());
            }
        }
        
        System.out.println("총 " + sentCount + "개 세션에 메시지 전송 완료 (본인 포함)");
        
        // 7. 수신자에게 읽지 않은 메시지 수 업데이트 알림
        try {
            Long unreadCount = chatService.getUnreadMessageCountByRoomId(chatRoom.getRoomId(), dto.getReceiverId());
            String unreadNotification = objectMapper.writeValueAsString(Map.of(
                "type", "unread_count_update",
                "roomId", chatRoom.getRoomId(),
                "unreadCount", unreadCount
            ));
            
            // 수신자 세션에 읽지 않은 메시지 수 알림 전송
            for (WebSocketSession s : sessions) {
                if (s.isOpen() && s.getPrincipal().getName().equals(dto.getReceiverId())) {
                    s.sendMessage(new TextMessage(unreadNotification));
                }
            }
        } catch (Exception e) {
            System.err.println("읽지 않은 메시지 수 알림 전송 실패: " + e.getMessage());
        }
        
        } catch (Exception e) {
            System.err.println("메시지 처리 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            // 예외 발생 시에도 연결을 유지하기 위해 에러를 던지지 않음
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        // 모든 채팅방에서 해당 세션 제거
        chatRoomSessions.values().forEach(sessions -> sessions.remove(session));
        System.out.println("연결 종료: " + session.getId());
    }
}