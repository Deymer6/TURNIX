package com.turnix.turnix_backend.controller;

import com.turnix.turnix_backend.model.DisponibilidadSemanal;
import com.turnix.turnix_backend.service.DisponibilidadSemanalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController

@RequestMapping("/api/disponibilidad") 
@CrossOrigin(origins = "http://localhost:4200") // ✅ Permite Angular
public class DisponibilidadSemanalController {

    @Autowired
    private DisponibilidadSemanalService disponibilidadSemanalService;

    @GetMapping
    public List<DisponibilidadSemanal> getDisponibilidades(
            @RequestParam(required = false) Integer profesionalId,
            @RequestParam(required = false) Integer diaSemana
    ) {
        if (profesionalId != null || diaSemana != null) {
            return disponibilidadSemanalService.getDisponibilidadPorFiltros(profesionalId, diaSemana);
        }
        return disponibilidadSemanalService.getAllDisponibilidades();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisponibilidadSemanal> getDisponibilidadById(@PathVariable Long id) {
        Optional<DisponibilidadSemanal> disponibilidad = disponibilidadSemanalService.getDisponibilidadById(id);
        return disponibilidad.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public DisponibilidadSemanal createDisponibilidad(@RequestBody DisponibilidadSemanal disponibilidad) {
        return disponibilidadSemanalService.createDisponibilidad(disponibilidad);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDisponibilidad(@PathVariable Long id) {
        disponibilidadSemanalService.deleteDisponibilidad(id);
        return ResponseEntity.noContent().build();
    }
}