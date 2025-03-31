package project.masil.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import project.masil.entity.PostEntity;

@Repository
public interface PostRepository extends JpaRepository<PostEntity,Integer >{

	
	List<PostEntity> findAll() ;
	
	PostEntity findByPostIdx(Integer postIdx) ;
	
	void deleteByPostIdx(Integer postIdx) ;
}
