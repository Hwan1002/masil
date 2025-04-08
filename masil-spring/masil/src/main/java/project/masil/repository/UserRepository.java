package project.masil.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import project.masil.entity.UserEntity;

@Repository
public interface UserRepository  extends JpaRepository<UserEntity,Integer >{

	Boolean existsByEmail(String email);
	
	Boolean existByEmailSocialUser(String email) ;

	
	Boolean existsByUserId(String userId);

	UserEntity findByUserId(String userId) ;
	
	Optional<UserEntity> findByEmail(String email) ;

	UserEntity findByRefreshToken(String refreshToken) ;
}
