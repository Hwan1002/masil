package project.masil.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import project.masil.entity.PostEntity;

@Repository
public interface PostRepository extends JpaRepository<PostEntity,Integer >{

	
	List<PostEntity> findAll() ;
	
	@Query("SELECT p FROM PostEntity p JOIN FETCH p.user WHERE p.postIdx = :postIdx")
	PostEntity findByPostIdxWithUser(@Param("postIdx") Integer postIdx);
	
	void deleteByPostIdx(Integer postIdx) ;
	
	// @ManyToOne 관계일떄 " _ " 로 속성경로 명시해줘야함 ;
	// 예: PostEntity.user 필드 → UserEntity.userId 참조
	List<PostEntity> findByUser_UserId(String userId);
	
	 @Query(value = """
		        SELECT * 
		        FROM boards
		        WHERE 
		            (lat BETWEEN :minLat AND :maxLat)
		            AND (lng BETWEEN :minLng AND :maxLng)
		            AND (
		                6371 * ACOS(
		                    COS(RADIANS(:lat)) * COS(RADIANS(lat)) *
		                    COS(RADIANS(lng) - RADIANS(:lng)) +
		                    SIN(RADIANS(:lat)) * SIN(RADIANS(lat))
		                ) <= 5
		            )
		        """, nativeQuery = true)
		    List<PostEntity> findNearbyPosts(
		        @Param("lat") double lat,
		        @Param("lng") double lng,
		        @Param("minLat") double minLat,
		        @Param("maxLat") double maxLat,
		        @Param("minLng") double minLng,
		        @Param("maxLng") double maxLng
		    );
	
}
