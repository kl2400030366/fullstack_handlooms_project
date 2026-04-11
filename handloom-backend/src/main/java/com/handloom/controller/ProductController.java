package com.handloom.controller;

import com.handloom.dto.ProductDtos.*;
import com.handloom.entity.User;
import com.handloom.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/api/products/public")
    public ResponseEntity<?> getPublicProducts() {
        return ResponseEntity.ok(productService.getPublicProducts());
    }

    @GetMapping("/api/artisan/products")
    public ResponseEntity<?> getArtisanProducts(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(productService.getArtisanProducts(user));
    }

    @PostMapping("/api/artisan/products")
    public ResponseEntity<?> addProduct(@RequestBody ProductRequest req, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(productService.addProduct(req, user));
    }

    @PutMapping("/api/artisan/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductRequest req, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(productService.updateProduct(id, req, user));
    }

    @DeleteMapping("/api/artisan/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, @AuthenticationPrincipal User user) {
        productService.deleteProduct(id, user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/artisan/inventory")
    public ResponseEntity<?> getInventory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(productService.getArtisanProducts(user));
    }

    @PutMapping("/api/artisan/inventory/{id}")
    public ResponseEntity<?> updateInventory(@PathVariable Long id, @RequestBody java.util.Map<String, Integer> body, @AuthenticationPrincipal User user) {
        ProductRequest req = new ProductRequest();
        var products = productService.getArtisanProducts(user);
        var existing = products.stream().filter(p -> p.getId().equals(id)).findFirst().orElseThrow();
        req.setName(existing.getName()); req.setDescription(existing.getDescription());
        req.setPrice(existing.getPrice()); req.setQuantity(body.get("quantity"));
        req.setCategory(existing.getCategory()); req.setImageUrl(existing.getImageUrl());
        req.setMaterial(existing.getMaterial()); req.setOrigin(existing.getOrigin());
        return ResponseEntity.ok(productService.updateProduct(id, req, user));
    }
}
