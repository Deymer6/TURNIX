package com.turnix.turnix_backend.controller;

import com.turnix.turnix_backend.model.Profesional;
import com.turnix.turnix_backend.service.ProfesionalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/profesionales")
@EnableMethodSecurity(prePostEnabled = true)
public class ProfesionalController {

    @Autowired
    private ProfesionalService profesionalService;

    @GetMapping
    public List<Profesional> getAllProfesionales() {
        return profesionalService.getAllProfesionales();
    }

   
    @GetMapping("/{id}")
    public ResponseEntity<Profesional> getProfesionalById(@PathVariable Integer id) {
        Optional<Profesional> profesional = profesionalService.getProfesionalById(id);
        return profesional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Profesional createProfesional(@RequestBody Profesional profesional) {
        return profesionalService.createProfesional(profesional);
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<Profesional> updateProfesional(@PathVariable Integer id, @RequestBody Profesional profesional) {
        Profesional updated = profesionalService.updateProfesional(id, profesional);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfesional(@PathVariable Integer id) {
        profesionalService.deleteProfesional(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/negocio/{negocioId}")
    public List<Profesional> getProfesionalesByNegocio(@PathVariable Integer negocioId) {
        return profesionalService.getProfesionalesByNegocioId(negocioId);
    }
}