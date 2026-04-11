package com.handloom.repository;

import com.handloom.entity.Product;
import com.handloom.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByApprovedTrue();
    List<Product> findByArtisan(User artisan);
    List<Product> findByArtisanAndApprovedTrue(User artisan);
    long countByArtisan(User artisan);
}
