package com.handloom.repository;

import com.handloom.entity.Order;
import com.handloom.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyer(User buyer);
    List<Order> findByBuyerOrderByCreatedAtDesc(User buyer);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'DELIVERED'")
    Double getTotalRevenue();

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'DELIVERED' AND DATE(o.createdAt) = CURRENT_DATE")
    Double getTodayRevenue();

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'DELIVERED' AND MONTH(o.createdAt) = MONTH(CURRENT_DATE)")
    Double getMonthlyRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = ?1")
    long countByStatus(Order.OrderStatus status);
}
