package com.handloom.service;

import com.handloom.dto.AuthDtos.UserResponse;
import com.handloom.entity.Order;
import com.handloom.entity.User;
import com.handloom.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalProducts", productRepository.count());
        stats.put("totalOrders", orderRepository.count());
        stats.put("totalRevenue", orderRepository.getTotalRevenue());
        stats.put("totalArtisans", userRepository.countByRole(User.Role.ARTISAN));
        stats.put("totalBuyers", userRepository.countByRole(User.Role.BUYER));
        return stats;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::toUserResponse).collect(Collectors.toList());
    }

    public void updateUserStatus(Long id, boolean active) {
        User user = userRepository.findById(id).orElseThrow();
        user.setActive(active);
        userRepository.save(user);
    }

    public void updateUserRole(Long id, String role) {
        User user = userRepository.findById(id).orElseThrow();
        user.setRole(User.Role.valueOf(role));
        userRepository.save(user);
    }

    public Map<String, Object> getReports() {
        Map<String, Object> report = new HashMap<>();
        report.put("totalRevenue", orderRepository.getTotalRevenue());
        report.put("todayRevenue", orderRepository.getTodayRevenue());
        report.put("monthlyRevenue", orderRepository.getMonthlyRevenue());

        long totalOrders = orderRepository.count();
        report.put("avgOrderValue", totalOrders > 0 ? (orderRepository.getTotalRevenue() != null ? orderRepository.getTotalRevenue() / totalOrders : 0) : 0);

        Map<String, Long> ordersByStatus = new LinkedHashMap<>();
        for (Order.OrderStatus s : Order.OrderStatus.values()) {
            ordersByStatus.put(s.name(), orderRepository.countByStatus(s));
        }
        report.put("ordersByStatus", ordersByStatus);
        report.put("topProducts", getTopProducts());
        return report;
    }

    private List<Map<String, Object>> getTopProducts() {
        return orderRepository.findAll().stream()
                .flatMap(o -> o.getItems().stream())
                .collect(Collectors.groupingBy(i -> i.getProduct().getId()))
                .entrySet().stream()
                .map(e -> {
                    var items = e.getValue();
                    Map<String, Object> m = new HashMap<>();
                    m.put("productId", e.getKey());
                    m.put("productName", items.get(0).getProduct().getName());
                    m.put("artisanName", items.get(0).getProduct().getArtisan().getName());
                    m.put("unitsSold", items.stream().mapToInt(i -> i.getQuantity()).sum());
                    m.put("revenue", items.stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum());
                    return m;
                })
                .sorted((a, b) -> Integer.compare((int) b.get("unitsSold"), (int) a.get("unitsSold")))
                .limit(10)
                .collect(Collectors.toList());
    }

    private UserResponse toUserResponse(User u) {
        UserResponse r = new UserResponse();
        r.setId(u.getId()); r.setName(u.getName()); r.setEmail(u.getEmail());
        r.setRole(u.getRole().name()); r.setPhone(u.getPhone()); r.setActive(u.isActive());
        return r;
    }
}
