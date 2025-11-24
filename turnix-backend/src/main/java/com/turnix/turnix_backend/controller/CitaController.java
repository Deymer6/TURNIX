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
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.time.LocalDateTime;

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

        CitaResponseDTO resp = new CitaResponseDTO();
        resp.setId(created.getId() == null ? null : created.getId().longValue());
        resp.setClienteId(created.getCliente() != null && created.getCliente().getId() != null ? created.getCliente().getId().longValue() : null);
        resp.setNegocioId(created.getNegocio() != null && created.getNegocio().getId() != null ? created.getNegocio().getId().longValue() : null);
        resp.setProfesionalId(created.getProfesional() != null && created.getProfesional().getId() != null ? created.getProfesional().getId().longValue() : null);
        resp.setServicioId(created.getServicio() != null && created.getServicio().getId() != null ? created.getServicio().getId().longValue() : null);
        resp.setFechaHoraInicio(created.getFechaHoraInicio());
        resp.setFechaHoraFin(created.getFechaHoraFin());
        resp.setEstado(created.getEstado());
        resp.setPrecioFinal(created.getPrecioFinal());
        resp.setNotasPromocion(created.getNotasPromocion());

        return ResponseEntity.status(201).body(resp);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCita(@PathVariable Long id) {
        citaService.deleteCita(id);
        return ResponseEntity.noContent().build();
    }
}