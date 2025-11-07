package project.masil.repository.chatting;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import project.masil.entity.chatting.ChatMessageEntity;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity,Long>{

	// 해당채팅방(idx == roomId)에 채팅메세지 반환
    @Query("SELECT m FROM ChatMessageEntity m WHERE m.chatRoom.roomId = :roomId")
    List<ChatMessageEntity> findMessagesByRoomId(@Param("roomId") Long roomId);
    
    //0926 특정 사용자가 읽지 않은 메시지 수 조회
    @Query("SELECT COUNT(m) FROM ChatMessageEntity m WHERE m.receiver.userId = :userId AND m.isRead = false")
    Long countUnreadMessagesByUserId(@Param("userId") String userId);
    
    //0926 특정 채팅방에서 특정 사용자가 읽지 않은 메시지 수 조회
    @Query("SELECT COUNT(m) FROM ChatMessageEntity m WHERE m.chatRoom.roomId = :roomId AND m.receiver.userId = :userId AND m.isRead = false")
    Long countUnreadMessagesByRoomIdAndUserId(@Param("roomId") Long roomId, @Param("userId") String userId);
    
    //0926 특정 채팅방에서 특정 사용자의 읽지 않은 메시지들을 읽음 처리
    @Query("UPDATE ChatMessageEntity m SET m.isRead = true WHERE m.chatRoom.roomId = :roomId AND m.receiver.userId = :userId AND m.isRead = false")
    void markMessagesAsRead(@Param("roomId") Long roomId, @Param("userId") String userId);
	
}
