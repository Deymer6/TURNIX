package com.turnix.turnix_backend.controller;

import com.turnix.turnix_backend.model.Promocion;
import com.turnix.turnix_backend.service.PromocionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class PromocionController {

    @Autowired
    private PromocionService promocionService;

    @GetMapping("/negocios/{negocioId}/promociones")
    public List<Promocion> getPromocionesByNegocioId(@PathVariable Integer negocioId) {
        return promocionService.getPromocionesByNegocioId(negocioId);
    }

    @GetMapping("/promociones/{id}")
    public ResponseEntity<Promocion> getPromocionById(@PathVariable Long id) {
        Optional<Promocion> promocion = promocionService.getPromocionById(id);
        return promocion.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/promociones")
    public Promocion createPromocion(@RequestBody Promocion promocion) {
        return promocionService.createPromocion(promocion);
    }

    @DeleteMapping("/promociones/{id}")
    public ResponseEntity<Void> deletePromocion(@PathVariable Long id) {
        promocionService.deletePromocion(id);
        return ResponseEntity.noContent().build();
    }
}