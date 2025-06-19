package project.masil.repository.chatting;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import project.masil.entity.chatting.ChatRoomEntity;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoomEntity, Long> {

	
	// 채팅을보낸사람과 채팅을받는사람의 1:1 채팅방을 조회하는 메서드
	@Query("SELECT c FROM ChatRoomEntity c "
			+ "WHERE (c.lender.userId = :lenderId AND c.borrower.userId = :borrowerId) "
			+ "   OR (c.lender.userId = :borrowerId AND c.borrower.userId = :lenderId)")
	Optional<ChatRoomEntity> findByLenderIdAndBorrowerId(@Param("lenderId") String lenderId,@Param("borrowerId") String borrowerId);
	
	// roomId 를 통한 ChatRoomEntity 조회
	Optional<ChatRoomEntity> findByRoomId(Long roomId) ;
	
}
