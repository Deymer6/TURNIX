package com.turnix.turnix_backend.controller;

import com.turnix.turnix_backend.model.GaleriaNegocio;
import com.turnix.turnix_backend.service.GaleriaNegocioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/galerias")
public class GaleriaNegocioController {

    @Autowired
    private GaleriaNegocioService galeriaNegocioService;

    @GetMapping
    public List<GaleriaNegocio> getAllGalerias() {
        return galeriaNegocioService.getAllGalerias();
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<GaleriaNegocio> getGaleriaById(@PathVariable Long id) {
        Optional<GaleriaNegocio> galeria = galeriaNegocioService.getGaleriaById(id);
        return galeria.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    
    @GetMapping("/negocio/{negocioId}")
    public List<GaleriaNegocio> getGaleriasByNegocio(@PathVariable Long negocioId) {
        return galeriaNegocioService.getGaleriasByNegocioId(negocioId);
    }

    @PostMapping
    public GaleriaNegocio createGaleria(@RequestBody GaleriaNegocio galeria) {
        return galeriaNegocioService.createGaleria(galeria);
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGaleria(@PathVariable Long id) {
        galeriaNegocioService.deleteGaleria(id);
        return ResponseEntity.noContent().build();
    }
}