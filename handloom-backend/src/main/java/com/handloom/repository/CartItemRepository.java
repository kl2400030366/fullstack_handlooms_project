package com.handloom.repository;

import com.handloom.entity.CartItem;
import com.handloom.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByBuyer(User buyer);
    Optional<CartItem> findByBuyerAndProductId(User buyer, Long productId);
    void deleteByBuyer(User buyer);
}
