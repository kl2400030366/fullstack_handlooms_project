package com.handloom.dto;

import lombok.Data;

public class ProductDtos {

    @Data
    public static class ProductRequest {
        private String name;
        private String description;
        private Double price;
        private Integer quantity;
        private String category;
        private String imageUrl;
        private String material;
        private String origin;
    }

    @Data
    public static class ProductResponse {
        private Long id;
        private String name;
        private String description;
        private Double price;
        private Integer quantity;
        private String category;
        private String imageUrl;
        private String material;
        private String origin;
        private boolean approved;
        private Long artisanId;
        private String artisanName;
    }
}
