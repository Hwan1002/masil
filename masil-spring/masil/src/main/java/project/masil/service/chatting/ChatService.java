package project.masil.service.chatting;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import project.masil.dto.chat.ChatMessageDTO;
import project.masil.dto.chat.ChatRoomDTO;
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
	@Transactional
	public ChatRoomDTO findOrCreateChatRoom(String borrowerId, String lenderId) {
		return chatRoomEntityToDTO(chatRoomRepository.findByLenderIdAndBorrowerId(lenderId, borrowerId)
				.orElseGet(() -> createChatRoom(borrowerId, lenderId))) ;
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

	// roomId 를 통한 채팅메세지 조회
	public List<ChatMessageDTO> findMessagesByRoomId(Long roomId) {
		return messageEntityToDTO(chatMessageRepository.findMessagesByRoomId(roomId));
	}
	
	
	// 메세지 저장
	@Transactional
	public ChatMessageEntity saveMessage(ChatRoomDTO chatRoomDTO, ChatMessageDTO dto) {
		UserEntity sender = userRepository.findByUserId(dto.getSenderId())
				.orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다: " + dto.getSenderId()));
		ChatRoomEntity chatRoom = chatRoomRepository.findByRoomId(chatRoomDTO.getRoomId())
				.orElseThrow(() -> new IllegalArgumentException("해당 채팅방을 찾을 수 없습니다 ." + chatRoomDTO.getRoomId()));
		
		// 1. DTO를 엔티티로 변환
		ChatMessageEntity message = ChatMessageEntity.builder().chatRoom(chatRoom).sender(sender) // 또는 session에서 꺼낸 senderId																									
				.content(dto.getContent()).build();

		// 2. DB에 저장
		return chatMessageRepository.save(message);

	}
	

	//chatRoomEntity-> chatRoomDTO
	public ChatRoomDTO chatRoomEntityToDTO(ChatRoomEntity chatRoom) {
		return	ChatRoomDTO.builder().roomId(chatRoom.getRoomId())
				.createdAt(chatRoom.getCreatedAt())
				.lenderId(chatRoom.getLender().getUserId())
				.borrowerId(chatRoom.getBorrower().getUserId())
				.lenderNickname(chatRoom.getLender().getUserNickName())
				.borrowerNickname(chatRoom.getBorrower().getUserNickName()) 
				.build();
	}
	
	
	
	//chatMessageEntity -> chatMessageDTO 메세지는 항상 방을기준으로 조회되기때문에 List로만 반환하고 리스트->리스트로 반환하는 convert메서드로 작성했음 
	public List<ChatMessageDTO> messageEntityToDTO(List<ChatMessageEntity> messages) {
		return messages.stream().map(m -> ChatMessageDTO.builder()
				.messageId(m.getMessageId())
				.senderId(m.getSender().getUserId())
				.content(m.getContent())
				.sentAt(m.getSentAt())
				.build()).collect(Collectors.toList());
	}
	
	
	
	
	
	
	
	
	

}