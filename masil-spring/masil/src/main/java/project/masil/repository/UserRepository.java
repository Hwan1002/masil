package project.masil.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import net.bytebuddy.dynamic.DynamicType.Builder.FieldDefinition.Optional;
import project.masil.entity.UserEntity;

@Repository
public interface UserRepository  extends JpaRepository<UserEntity,String >{

	Boolean existsByEmail(String email);
	
	Boolean existsByUserId(String userId);

	UserEntity findByUserId(String userId) ;
}
