package project.masil.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "user_wishes")
public class UserWishEntity {

	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id ;
	
    @ManyToOne
    @JoinColumn(name = "user_idx")
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "post_idx")
    private PostEntity post;

	
}
