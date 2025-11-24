package com.turnix.turnix_backend.controller;

import com.turnix.turnix_backend.model.Profesional;
import com.turnix.turnix_backend.service.ProfesionalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/profesionales")
public class ProfesionalController {

    @Autowired
    private ProfesionalService profesionalService;

    @GetMapping
    public List<Profesional> getAllProfesionales() {
        return profesionalService.getAllProfesionales();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profesional> getProfesionalById(@PathVariable Long id) {
        Optional<Profesional> profesional = profesionalService.getProfesionalById(id);
        return profesional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Profesional createProfesional(@RequestBody Profesional profesional) {
        return profesionalService.createProfesional(profesional);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfesional(@PathVariable Long id) {
        profesionalService.deleteProfesional(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/negocio/{negocioId}")
    public List<Profesional> getProfesionalesByNegocio(@PathVariable Integer negocioId) { // O Long
    return profesionalService.getProfesionalesByNegocioId(negocioId);
}
}