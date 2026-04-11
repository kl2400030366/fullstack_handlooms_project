package com.handloom.controller;

import com.handloom.entity.User;
import com.handloom.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/artisan")
@RequiredArgsConstructor
public class ArtisanController {

    private final OrderService orderService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getArtisanStats(user));
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getArtisanOrders(user));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        orderService.updateOrderStatus(id, body.get("status"));
        return ResponseEntity.ok().build();
    }
}
