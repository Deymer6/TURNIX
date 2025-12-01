package com.turnix.turnix_backend.controller;

import com.turnix.turnix_backend.model.Negocio;
import com.turnix.turnix_backend.model.Promocion;
import com.turnix.turnix_backend.model.Usuario;
import com.turnix.turnix_backend.service.NegocioService;
import com.turnix.turnix_backend.service.PromocionService;
import com.turnix.turnix_backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@EnableMethodSecurity(prePostEnabled = true)
public class PromocionController {

    @Autowired
    private PromocionService promocionService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private NegocioService negocioService;

    @GetMapping("/promociones/negocio/{negocioId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Promocion> getPromocionesByNegocioId(@PathVariable Integer negocioId, Principal principal) {
        String userEmail = principal.getName();
        Usuario authenticatedUser = usuarioService.getUsuarioByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));

        Optional<Negocio> ownedNegocio = negocioService.getNegocioByDueno(authenticatedUser);

        if (ownedNegocio.isEmpty() || !ownedNegocio.get().getId().equals(negocioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acceso denegado. No eres el propietario de este negocio o el negocio no existe.");
        }

        return promocionService.getPromocionesByNegocioId(negocioId);
    }

    @GetMapping("/promociones/{id}")
    public ResponseEntity<Promocion> getPromocionById(@PathVariable Integer id) {
        Optional<Promocion> promocion = promocionService.getPromocionById(id);
        return promocion.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/promociones")
    public Promocion createPromocion(@RequestBody Promocion promocion) {
        return promocionService.createPromocion(promocion);
    }
    
    @PutMapping("/promociones/{id}")
    public ResponseEntity<Promocion> updatePromocion(@PathVariable Integer id, @RequestBody Promocion promocion) {
        Promocion actualizada = promocionService.updatePromocion(id, promocion);
        if (actualizada != null) {
            return ResponseEntity.ok(actualizada);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/promociones/{id}")
    public ResponseEntity<Void> deletePromocion(@PathVariable Integer id) {
        promocionService.deletePromocion(id);
        return ResponseEntity.noContent().build();
    }
}