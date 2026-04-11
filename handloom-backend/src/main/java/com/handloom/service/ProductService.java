package com.handloom.service;

import com.handloom.dto.ProductDtos.*;
import com.handloom.entity.Product;
import com.handloom.entity.User;
import com.handloom.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponse> getPublicProducts() {
        return productRepository.findByApprovedTrue().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ProductResponse> getArtisanProducts(User artisan) {
        return productRepository.findByArtisan(artisan).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProductResponse addProduct(ProductRequest req, User artisan) {
        Product p = Product.builder()
                .name(req.getName()).description(req.getDescription())
                .price(req.getPrice()).quantity(req.getQuantity())
                .category(req.getCategory()).imageUrl(req.getImageUrl())
                .material(req.getMaterial()).origin(req.getOrigin())
                .artisan(artisan).approved(false).build();
        return toResponse(productRepository.save(p));
    }

    public ProductResponse updateProduct(Long id, ProductRequest req, User artisan) {
        Product p = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        if (!p.getArtisan().getId().equals(artisan.getId())) throw new RuntimeException("Unauthorized");
        p.setName(req.getName()); p.setDescription(req.getDescription());
        p.setPrice(req.getPrice()); p.setQuantity(req.getQuantity());
        p.setCategory(req.getCategory()); p.setImageUrl(req.getImageUrl());
        p.setMaterial(req.getMaterial()); p.setOrigin(req.getOrigin());
        return toResponse(productRepository.save(p));
    }

    public void deleteProduct(Long id, User artisan) {
        Product p = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        if (!p.getArtisan().getId().equals(artisan.getId())) throw new RuntimeException("Unauthorized");
        productRepository.delete(p);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public void approveProduct(Long id, boolean approved) {
        Product p = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        p.setApproved(approved);
        productRepository.save(p);
    }

    public void adminDeleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public ProductResponse toResponse(Product p) {
        ProductResponse r = new ProductResponse();
        r.setId(p.getId()); r.setName(p.getName()); r.setDescription(p.getDescription());
        r.setPrice(p.getPrice()); r.setQuantity(p.getQuantity()); r.setCategory(p.getCategory());
        r.setImageUrl(p.getImageUrl()); r.setMaterial(p.getMaterial()); r.setOrigin(p.getOrigin());
        r.setApproved(p.isApproved());
        if (p.getArtisan() != null) { r.setArtisanId(p.getArtisan().getId()); r.setArtisanName(p.getArtisan().getName()); }
        return r;
    }
}
