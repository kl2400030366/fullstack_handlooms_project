package com.handloom.service;

import com.handloom.dto.OrderDtos.*;
import com.handloom.entity.*;
import com.handloom.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final CartItemRepository cartItemRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;

    // Cart
    public List<CartResponse> getCart(User buyer) {
        return cartItemRepository.findByBuyer(buyer).stream().map(this::toCartResponse).collect(Collectors.toList());
    }

    public void addToCart(User buyer, CartRequest req) {
        var existing = cartItemRepository.findByBuyerAndProductId(buyer, req.getProductId());
        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + req.getQuantity());
            cartItemRepository.save(item);
        } else {
            Product product = productRepository.findById(req.getProductId()).orElseThrow();
            cartItemRepository.save(CartItem.builder().buyer(buyer).product(product).quantity(req.getQuantity()).build());
        }
    }

    public void updateCartItem(Long cartItemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(cartItemId).orElseThrow();
        item.setQuantity(quantity);
        cartItemRepository.save(item);
    }

    public void removeFromCart(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    // Checkout
    @Transactional
    public OrderResponse checkout(User buyer, CheckoutRequest req) {
        List<CartItem> cartItems = cartItemRepository.findByBuyer(buyer);
        if (cartItems.isEmpty()) throw new RuntimeException("Cart is empty");

        double total = cartItems.stream().mapToDouble(i -> i.getProduct().getPrice() * i.getQuantity()).sum();

        Order order = Order.builder()
                .buyer(buyer).address(req.getAddress())
                .totalAmount(total).status(Order.OrderStatus.PENDING).build();
        Order saved = orderRepository.save(order);

        List<OrderItem> items = cartItems.stream().map(ci -> {
            Product p = ci.getProduct();
            p.setQuantity(p.getQuantity() - ci.getQuantity());
            productRepository.save(p);
            return OrderItem.builder()
                    .order(saved).product(p)
                    .quantity(ci.getQuantity()).price(p.getPrice()).build();
        }).collect(Collectors.toList());

        saved.setItems(items);
        orderRepository.save(saved);
        cartItemRepository.deleteByBuyer(buyer);
        return toOrderResponse(saved);
    }

    public List<OrderResponse> getBuyerOrders(User buyer) {
        return orderRepository.findByBuyerOrderByCreatedAtDesc(buyer).stream()
                .map(this::toOrderResponse).collect(Collectors.toList());
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::toOrderResponse).collect(Collectors.toList());
    }

    public void cancelOrder(Long orderId, User buyer) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        if (!order.getBuyer().getId().equals(buyer.getId())) throw new RuntimeException("Unauthorized");
        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    public void submitReview(Long orderId, User buyer, ReviewRequest req) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        if (!order.getBuyer().getId().equals(buyer.getId())) throw new RuntimeException("Unauthorized");
        order.getItems().forEach(item ->
            reviewRepository.save(Review.builder()
                    .order(order).buyer(buyer).product(item.getProduct())
                    .rating(req.getRating()).comment(req.getComment()).build())
        );
        order.setReviewed(true);
        orderRepository.save(order);
    }

    // Wishlist
    public List<WishlistResponse> getWishlist(User buyer) {
        return wishlistItemRepository.findByBuyer(buyer).stream()
                .map(this::toWishlistResponse).collect(Collectors.toList());
    }

    public void addToWishlist(User buyer, Long productId) {
        if (wishlistItemRepository.findByBuyerAndProductId(buyer, productId).isEmpty()) {
            Product product = productRepository.findById(productId).orElseThrow();
            wishlistItemRepository.save(WishlistItem.builder().buyer(buyer).product(product).build());
        }
    }

    public void removeFromWishlist(Long wishlistItemId) {
        wishlistItemRepository.deleteById(wishlistItemId);
    }

    // Artisan order management
    public List<OrderResponse> getArtisanOrders(User artisan) {
        return orderRepository.findAll().stream()
                .filter(o -> o.getItems() != null && o.getItems().stream()
                        .anyMatch(i -> i.getProduct().getArtisan().getId().equals(artisan.getId())))
                .map(o -> toArtisanOrderResponse(o, artisan))
                .collect(Collectors.toList());
    }

    public void updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(Order.OrderStatus.valueOf(status));
        orderRepository.save(order);
    }

    // Artisan stats
    public java.util.Map<String, Object> getArtisanStats(User artisan) {
        List<Order> allOrders = orderRepository.findAll();
        List<Order> artisanOrders = allOrders.stream()
                .filter(o -> o.getItems() != null && o.getItems().stream()
                        .anyMatch(i -> i.getProduct().getArtisan().getId().equals(artisan.getId())))
                .collect(Collectors.toList());

        long totalProducts = productRepository.countByArtisan(artisan);
        long totalOrders = artisanOrders.size();
        long pendingOrders = artisanOrders.stream().filter(o -> o.getStatus() == Order.OrderStatus.PENDING).count();
        double revenue = artisanOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.DELIVERED)
                .flatMap(o -> o.getItems().stream())
                .filter(i -> i.getProduct().getArtisan().getId().equals(artisan.getId()))
                .mapToDouble(i -> i.getPrice() * i.getQuantity()).sum();
        long lowStock = productRepository.findByArtisan(artisan).stream()
                .filter(p -> p.getQuantity() < 5).count();

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalProducts", totalProducts);
        stats.put("totalOrders", totalOrders);
        stats.put("pendingOrders", pendingOrders);
        stats.put("revenue", revenue);
        stats.put("lowStock", lowStock);
        return stats;
    }

    // Mappers
    private CartResponse toCartResponse(CartItem ci) {
        CartResponse r = new CartResponse();
        r.setId(ci.getId());
        r.setProductId(ci.getProduct().getId());
        r.setProductName(ci.getProduct().getName());
        r.setImageUrl(ci.getProduct().getImageUrl());
        r.setPrice(ci.getProduct().getPrice());
        r.setQuantity(ci.getQuantity());
        return r;
    }

    private WishlistResponse toWishlistResponse(WishlistItem wi) {
        WishlistResponse r = new WishlistResponse();
        r.setId(wi.getId());
        r.setProductId(wi.getProduct().getId());
        r.setProductName(wi.getProduct().getName());
        r.setImageUrl(wi.getProduct().getImageUrl());
        r.setPrice(wi.getProduct().getPrice());
        return r;
    }

    public OrderResponse toOrderResponse(Order o) {
        OrderResponse r = new OrderResponse();
        r.setId(o.getId());
        r.setBuyerName(o.getBuyer().getName());
        r.setAddress(o.getAddress());
        r.setTotalAmount(o.getTotalAmount());
        r.setStatus(o.getStatus().name());
        r.setReviewed(o.isReviewed());
        r.setCreatedAt(o.getCreatedAt());
        if (o.getItems() != null) {
            r.setItems(o.getItems().stream().map(i -> {
                OrderItemResponse ir = new OrderItemResponse();
                ir.setId(i.getId());
                ir.setProductName(i.getProduct().getName());
                ir.setQuantity(i.getQuantity());
                ir.setPrice(i.getPrice());
                return ir;
            }).collect(Collectors.toList()));
        }
        return r;
    }

    private OrderResponse toArtisanOrderResponse(Order o, User artisan) {
        OrderResponse r = toOrderResponse(o);
        if (o.getItems() != null) {
            r.setItems(o.getItems().stream()
                    .filter(i -> i.getProduct().getArtisan().getId().equals(artisan.getId()))
                    .map(i -> {
                        OrderItemResponse ir = new OrderItemResponse();
                        ir.setId(i.getId());
                        ir.setProductName(i.getProduct().getName());
                        ir.setQuantity(i.getQuantity());
                        ir.setPrice(i.getPrice());
                        return ir;
                    }).collect(Collectors.toList()));
        }
        return r;
    }
}
