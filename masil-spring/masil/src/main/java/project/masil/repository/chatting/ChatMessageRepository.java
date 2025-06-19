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
	
}
