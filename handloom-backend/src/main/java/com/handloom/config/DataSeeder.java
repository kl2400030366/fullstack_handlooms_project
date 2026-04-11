package com.handloom.config;

import com.handloom.entity.*;
import com.handloom.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin
        if (!userRepository.existsByEmail("admin@handloom.com")) {
            userRepository.save(User.builder()
                    .name("Admin").email("admin@handloom.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN).active(true).build());
        }

        // Create sample artisan
        if (!userRepository.existsByEmail("artisan@handloom.com")) {
            User artisan = userRepository.save(User.builder()
                    .name("Ravi Kumar").email("artisan@handloom.com")
                    .password(passwordEncoder.encode("artisan123"))
                    .phone("9876543210").role(User.Role.ARTISAN).active(true).build());

            // Sample products
            String[][] products = {
                {"Banarasi Silk Saree", "Exquisite handwoven Banarasi silk saree with zari work", "8500", "Sarees", "Silk", "Varanasi"},
                {"Kanjivaram Silk Saree", "Traditional Kanjivaram silk with gold border", "12000", "Sarees", "Silk", "Kanchipuram"},
                {"Handloom Cotton Kurta", "Breathable handloom cotton kurta for daily wear", "1200", "Kurtas", "Cotton", "Rajasthan"},
                {"Ikat Dupatta", "Vibrant double ikat woven dupatta", "2500", "Dupattas", "Cotton-Silk", "Odisha"},
                {"Pashmina Shawl", "Pure pashmina hand-embroidered shawl", "15000", "Shawls", "Pashmina", "Kashmir"},
            };

            for (String[] p : products) {
                productRepository.save(Product.builder()
                        .name(p[0]).description(p[1])
                        .price(Double.parseDouble(p[2])).quantity(50)
                        .category(p[3]).material(p[4]).origin(p[5])
                        .artisan(artisan).approved(true).build());
            }
        }

        // Create sample buyer
        if (!userRepository.existsByEmail("buyer@handloom.com")) {
            userRepository.save(User.builder()
                    .name("Priya Sharma").email("buyer@handloom.com")
                    .password(passwordEncoder.encode("buyer123"))
                    .phone("9123456789").role(User.Role.BUYER).active(true).build());
        }

        // Create sample marketing user
        if (!userRepository.existsByEmail("marketing@handloom.com")) {
            userRepository.save(User.builder()
                    .name("Anita Singh").email("marketing@handloom.com")
                    .password(passwordEncoder.encode("marketing123"))
                    .phone("9012345678").role(User.Role.MARKETING).active(true).build());
        }
    }
}
