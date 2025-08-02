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

	private final ObjectMapper objectMapper = new ObjectMapper();
	
	 @Override
	    public void afterConnectionEstablished(WebSocketSession session) {
	        // 연결 시점에는 아직 채팅방 정보를 알 수 없으므로, 핸드셰이크 또는 첫 메시지에서 채팅방에 세션 추가
	        System.out.println("새 연결: " + session.getId());
	    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // 발신자 추출(빌리는사람)
    	String senderId = session.getPrincipal().getName();
    	
    	// 1. 메시지 파싱 (Json -> DTO 변환)
    	String payload = message.getPayload();
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
        
        
        // 5. 해당 채팅방에 연결된 모든 세션에 메시지 브로드캐스트 (본인 제외)
        for (WebSocketSession s : sessions) {
            if (s.isOpen() && !s.equals(session)) {
                s.sendMessage(new TextMessage(objectMapper.writeValueAsString(chatMessage)));
            }
        }
        
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        // 모든 채팅방에서 해당 세션 제거
        chatRoomSessions.values().forEach(sessions -> sessions.remove(session));
        System.out.println("연결 종료: " + session.getId());
    }
}