package com.handloom.controller;

import com.handloom.entity.User;
import com.handloom.service.MarketingService;
import com.handloom.service.MarketingService.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/marketing")
@RequiredArgsConstructor
public class MarketingController {

    private final MarketingService marketingService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(marketingService.getStats());
    }

    @GetMapping("/campaigns")
    public ResponseEntity<?> getCampaigns(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(marketingService.getCampaigns(user));
    }

    @PostMapping("/campaigns")
    public ResponseEntity<?> createCampaign(@RequestBody CampaignRequest req, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(marketingService.createCampaign(req, user));
    }

    @PutMapping("/campaigns/{id}")
    public ResponseEntity<?> updateCampaign(@PathVariable Long id, @RequestBody CampaignRequest req,
                                             @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(marketingService.updateCampaign(id, req, user));
    }

    @DeleteMapping("/campaigns/{id}")
    public ResponseEntity<?> deleteCampaign(@PathVariable Long id) {
        marketingService.deleteCampaign(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/promotions")
    public ResponseEntity<?> getPromotions() {
        return ResponseEntity.ok(marketingService.getPromotions());
    }

    @PostMapping("/promotions")
    public ResponseEntity<?> createPromotion(@RequestBody PromotionRequest req, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(marketingService.createPromotion(req, user));
    }

    @PutMapping("/promotions/{id}/toggle")
    public ResponseEntity<?> togglePromotion(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        marketingService.togglePromotion(id, body.get("active"));
        return ResponseEntity.ok().build();
    }
}
