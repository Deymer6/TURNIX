package com.turnix.turnix_backend.controller;

import com.turnix.turnix_backend.model.ExcepcionHorario;
import com.turnix.turnix_backend.service.ExcepcionHorarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/excepciones")
public class ExcepcionHorarioController {

    @Autowired
    private ExcepcionHorarioService excepcionHorarioService;

    @GetMapping
    public List<ExcepcionHorario> getAllExcepciones() {
        return excepcionHorarioService.getAllExcepciones();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExcepcionHorario> getExcepcionById(@PathVariable Long id) {
        Optional<ExcepcionHorario> excepcion = excepcionHorarioService.getExcepcionById(id);
        return excepcion.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ExcepcionHorario createExcepcion(@RequestBody ExcepcionHorario excepcion) {
        return excepcionHorarioService.createExcepcion(excepcion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExcepcion(@PathVariable Long id) {
        excepcionHorarioService.deleteExcepcion(id);
        return ResponseEntity.noContent().build();
    }
}