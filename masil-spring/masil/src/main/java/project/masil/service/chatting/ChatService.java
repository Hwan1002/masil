package project.masil.service.chatting;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import project.masil.dto.chat.ChatMessageDTO;
import project.masil.entity.UserEntity;
import project.masil.entity.chatting.ChatMessageEntity;
import project.masil.entity.chatting.ChatRoomEntity;
import project.masil.repository.UserRepository;
import project.masil.repository.chatting.ChatMessageRepository;
import project.masil.repository.chatting.ChatRoomRepository;

@Service
public class ChatService {

	@Autowired
	private ChatRoomRepository chatRoomRepository;

	@Autowired
	private ChatMessageRepository chatMessageRepository;

	@Autowired
	private UserRepository userRepository;

	// 채팅방 조회 또는 생성
	public ChatRoomEntity findOrCreateChatRoom(String borrowerId, String lenderId) {
		return chatRoomRepository.findByLenderIdAndBorrowerId(lenderId, borrowerId)
				.orElseGet(() -> createChatRoom(borrowerId, lenderId));
	}

	// 채팅방이 없는경우 채팅방 생성
	private ChatRoomEntity createChatRoom(String borrowerId, String lenderId) {
		UserEntity borrower = userRepository.findByUserId(borrowerId)
				.orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다: " + borrowerId));
		UserEntity lender = userRepository.findByUserId(lenderId)
				.orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다: " + lenderId));

		ChatRoomEntity newRoom = ChatRoomEntity.builder().lender(lender) // 빌려주는 사람 or 수신자 (게시글 작성자)
				.borrower(borrower) // 빌리는 사람 or 발신자 (현재 사용자)
				.build();

		return chatRoomRepository.save(newRoom);
	}

	// 메세지 저장

	public ChatMessageEntity saveMessage(ChatRoomEntity chatRoom, ChatMessageDTO dto) {
		UserEntity sender = userRepository.findByUserId(dto.getSenderId())
				.orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다: " + dto.getSenderId()));
		
		// 1. DTO를 엔티티로 변환
		ChatMessageEntity message = ChatMessageEntity.builder().chatRoom(chatRoom).sender(sender) // 또는 session에서 꺼낸 senderId																									
				.content(dto.getContent()).build();

		// 2. DB에 저장
		return chatMessageRepository.save(message);

	}

}