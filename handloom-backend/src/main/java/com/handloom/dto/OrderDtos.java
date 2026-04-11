package com.handloom.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDtos {

    @Data
    public static class CartRequest {
        private Long productId;
        private Integer quantity;
    }

    @Data
    public static class CartResponse {
        private Long id;
        private Long productId;
        private String productName;
        private String imageUrl;
        private Double price;
        private Integer quantity;
    }

    @Data
    public static class CheckoutRequest {
        private String address;
    }

    @Data
    public static class OrderItemResponse {
        private Long id;
        private String productName;
        private Integer quantity;
        private Double price;
    }

    @Data
    public static class OrderResponse {
        private Long id;
        private String buyerName;
        private String address;
        private Double totalAmount;
        private String status;
        private boolean reviewed;
        private LocalDateTime createdAt;
        private List<OrderItemResponse> items;
    }

    @Data
    public static class ReviewRequest {
        private Integer rating;
        private String comment;
    }

    @Data
    public static class WishlistResponse {
        private Long id;
        private Long productId;
        private String productName;
        private String imageUrl;
        private Double price;
    }
}
