package project.masil.entity.chatting;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import project.masil.entity.UserEntity;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "Chat_Message")
@EntityListeners(AuditingEntityListener.class)
public class ChatMessageEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long messageId ;
	
    @ManyToOne
    @JoinColumn(name = "chat_room_id")
    private ChatRoomEntity chatRoom; // 메시지가 속한 채팅방
	 
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private UserEntity sender; // 메시지 보낸 사람
    
    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private UserEntity receiver; // 메시지 받는 사람
    
    @Column(nullable = false)
    private String content; // 메시지 내용

    @CreatedDate
    private LocalDateTime sentAt; // 메시지 전송 시각
    //0926 메세지 읽음 상태 추가
    @Column(nullable = false)
    @Builder.Default
    private Boolean isRead = false; 

}
