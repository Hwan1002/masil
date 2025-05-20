package project.masil.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import project.masil.entity.UserWishEntity;

@Repository
public interface UserWishRepository extends JpaRepository<UserWishEntity, Long> {

}
