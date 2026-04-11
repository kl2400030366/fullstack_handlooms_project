package com.handloom.repository;

import com.handloom.entity.Campaign;
import com.handloom.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByCreatedBy(User user);
    long countByActiveTrue();
}
