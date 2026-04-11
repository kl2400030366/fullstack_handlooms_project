package com.handloom.service;

import com.handloom.entity.Campaign;
import com.handloom.entity.Promotion;
import com.handloom.entity.User;
import com.handloom.repository.CampaignRepository;
import com.handloom.repository.PromotionRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MarketingService {

    private final CampaignRepository campaignRepository;
    private final PromotionRepository promotionRepository;

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("activeCampaigns", campaignRepository.countByActiveTrue());
        stats.put("totalPromotions", promotionRepository.count());
        stats.put("totalReach", 0);
        stats.put("conversions", 0);
        return stats;
    }

    public List<Campaign> getCampaigns(User user) {
        return campaignRepository.findByCreatedBy(user);
    }

    public Campaign createCampaign(CampaignRequest req, User user) {
        Campaign c = Campaign.builder()
                .title(req.getTitle()).description(req.getDescription())
                .startDate(LocalDate.parse(req.getStartDate())).endDate(LocalDate.parse(req.getEndDate()))
                .targetAudience(req.getTargetAudience()).budget(req.getBudget())
                .channel(req.getChannel()).active(true).createdBy(user).build();
        return campaignRepository.save(c);
    }

    public Campaign updateCampaign(Long id, CampaignRequest req, User user) {
        Campaign c = campaignRepository.findById(id).orElseThrow();
        c.setTitle(req.getTitle()); c.setDescription(req.getDescription());
        c.setStartDate(LocalDate.parse(req.getStartDate())); c.setEndDate(LocalDate.parse(req.getEndDate()));
        c.setTargetAudience(req.getTargetAudience()); c.setBudget(req.getBudget()); c.setChannel(req.getChannel());
        return campaignRepository.save(c);
    }

    public void deleteCampaign(Long id) {
        campaignRepository.deleteById(id);
    }

    public List<Promotion> getPromotions() {
        return promotionRepository.findAll();
    }

    public Promotion createPromotion(PromotionRequest req, User user) {
        Promotion p = Promotion.builder()
                .code(req.getCode()).discountType(req.getDiscountType())
                .discountValue(req.getDiscountValue()).minOrderAmount(req.getMinOrderAmount())
                .maxUsage(req.getMaxUsage()).expiryDate(LocalDate.parse(req.getExpiryDate()))
                .active(true).createdBy(user).usedCount(0).build();
        return promotionRepository.save(p);
    }

    public void togglePromotion(Long id, boolean active) {
        Promotion p = promotionRepository.findById(id).orElseThrow();
        p.setActive(active);
        promotionRepository.save(p);
    }

    @Data
    public static class CampaignRequest {
        private String title, description, startDate, endDate, targetAudience, channel;
        private Double budget;
    }

    @Data
    public static class PromotionRequest {
        private String code, discountType, expiryDate;
        private Double discountValue, minOrderAmount;
        private Integer maxUsage;
    }
}
