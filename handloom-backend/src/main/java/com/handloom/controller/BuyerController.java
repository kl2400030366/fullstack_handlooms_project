package com.handloom.controller;

import com.handloom.dto.OrderDtos.*;
import com.handloom.entity.User;
import com.handloom.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/buyer")
@RequiredArgsConstructor
public class BuyerController {

    private final OrderService orderService;

    // Cart
    @GetMapping("/cart")
    public ResponseEntity<?> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getCart(user));
    }

    @PostMapping("/cart")
    public ResponseEntity<?> addToCart(@RequestBody CartRequest req, @AuthenticationPrincipal User user) {
        orderService.addToCart(user, req);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/cart/{id}")
    public ResponseEntity<?> updateCart(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        orderService.updateCartItem(id, body.get("quantity"));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/cart/{id}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long id) {
        orderService.removeFromCart(id);
        return ResponseEntity.ok().build();
    }

    // Orders
    @PostMapping("/orders")
    public ResponseEntity<?> placeOrder(@RequestBody CheckoutRequest req, @AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(orderService.checkout(user, req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getBuyerOrders(user));
    }

    @PutMapping("/orders/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id, @AuthenticationPrincipal User user) {
        orderService.cancelOrder(id, user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/orders/{id}/review")
    public ResponseEntity<?> submitReview(@PathVariable Long id, @RequestBody ReviewRequest req,
                                          @AuthenticationPrincipal User user) {
        orderService.submitReview(id, user, req);
        return ResponseEntity.ok().build();
    }

    // Wishlist
    @GetMapping("/wishlist")
    public ResponseEntity<?> getWishlist(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getWishlist(user));
    }

    @PostMapping("/wishlist")
    public ResponseEntity<?> addToWishlist(@RequestBody Map<String, Long> body, @AuthenticationPrincipal User user) {
        orderService.addToWishlist(user, body.get("productId"));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/wishlist/{id}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long id) {
        orderService.removeFromWishlist(id);
        return ResponseEntity.ok().build();
    }
}
