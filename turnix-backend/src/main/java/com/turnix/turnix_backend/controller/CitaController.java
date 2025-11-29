package com.turnix.turnix_backend.controller;

import com.turnix.turnix_backend.dto.CitaRequestDTO;
import com.turnix.turnix_backend.dto.CitaResponseDTO;
import com.turnix.turnix_backend.model.Cita;
import com.turnix.turnix_backend.model.Usuario;
import com.turnix.turnix_backend.model.Negocio;
import com.turnix.turnix_backend.model.Profesional;
import com.turnix.turnix_backend.model.Servicio;
import com.turnix.turnix_backend.service.CitaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/citas") 
public class CitaController {

    @Autowired
    private CitaService citaService;

    @GetMapping("/{id}")
    public ResponseEntity<Cita> getCitaById(@PathVariable Long id) {
        Optional<Cita> cita = citaService.getCitaById(id);
        return cita.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/negocio/{negocioId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CitaResponseDTO>> getCitasByNegocioId(@PathVariable Integer negocioId) {
        List<Cita> citas = citaService.getCitasByNegocioId(negocioId);
        List<CitaResponseDTO> citaDTOs = citas.stream()
                .map(CitaResponseDTO::new) 
                .collect(Collectors.toList());
        return ResponseEntity.ok(citaDTOs);
    }


    @PostMapping
    public ResponseEntity<CitaResponseDTO> createCita(@Valid @RequestBody CitaRequestDTO dto) {
        Cita cita = new Cita();

        Usuario cliente = new Usuario();
        cliente.setId(dto.getClienteId() == null ? null : dto.getClienteId().intValue());
        cita.setCliente(cliente);

        Negocio negocio = new Negocio();
        negocio.setId(dto.getNegocioId() == null ? null : dto.getNegocioId().intValue());
        cita.setNegocio(negocio);

        Profesional profesional = new Profesional();
        profesional.setId(dto.getProfesionalId() == null ? null : dto.getProfesionalId().intValue());
        cita.setProfesional(profesional);

        Servicio servicio = new Servicio();
        servicio.setId(dto.getServicioId() == null ? null : dto.getServicioId().intValue());
        cita.setServicio(servicio);

        cita.setFechaHoraInicio(LocalDateTime.parse(dto.getFechaHoraInicio()));
        cita.setFechaHoraFin(LocalDateTime.parse(dto.getFechaHoraFin()));
        cita.setEstado(dto.getEstado());
        cita.setPrecioFinal(dto.getPrecioFinal());
        cita.setNotasPromocion(dto.getNotasPromocion());

        Cita created = citaService.createCita(cita);

        
        CitaResponseDTO resp = new CitaResponseDTO(created);

        return ResponseEntity.status(201).body(resp);
    }

    @DeleteMapping("/citas/{id}")
    public ResponseEntity<Void> deleteCita(@PathVariable Long id) {
        citaService.deleteCita(id);
        return ResponseEntity.noContent().build();
    }
}
