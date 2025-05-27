package project.masil.service.chatting;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import project.masil.repository.chatting.ChatMessageRepository;
import project.masil.repository.chatting.ChatRoomRepository;

@Service
public class ChatService {

	@Autowired
	private ChatRoomRepository chatRoomRepository;
	
	@Autowired
	private ChatMessageRepository chatMessageRepository;

	
//	// 채팅방 조회 또는 생성 
//    public ChatRoomEntity findOrCreateChatRoom(Long postId, Long senderId, Long receiverId) {
//        return chatRoomRepository.findByPostIdAndParticipants(postId, senderId, receiverId)
//            .orElseGet(() -> createChatRoom(postId, senderId, receiverId));
//    }
//
//    private ChatRoomEntity createChatRoom(Long postId, Long senderId, Long receiverId) {
//        ChatRoomEntity newRoom = ChatRoomEntity.builder()
//            .postId(postId)
//            .lenderId(receiverId) // 빌려주는 사람 (게시글 작성자)
//            .borrowerId(senderId) // 빌리는 사람 (현재 사용자)
//            .build();
//
//        return chatRoomRepository.save(newRoom);
//    }
	
	
}
