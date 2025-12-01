package com.turnix.turnix_backend.controller;

import com.turnix.turnix_backend.dto.CitaRequestDTO;
import com.turnix.turnix_backend.dto.CitaResponseDTO;
import com.turnix.turnix_backend.model.Cita;
import com.turnix.turnix_backend.model.Negocio;
import com.turnix.turnix_backend.model.Profesional;
import com.turnix.turnix_backend.model.Servicio;
import com.turnix.turnix_backend.model.Usuario;
import com.turnix.turnix_backend.service.CitaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "http://localhost:4200") // Permite la conexión desde Angular
public class CitaController {

    @Autowired
    private CitaService citaService;


    @GetMapping("/{id}")
    public ResponseEntity<CitaResponseDTO> getCitaById(@PathVariable Integer id) {
        Optional<Cita> cita = citaService.getCitaById(id);
        return cita.map(c -> ResponseEntity.ok(new CitaResponseDTO(c)))
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @GetMapping("/negocio/{negocioId}")
    public ResponseEntity<List<CitaResponseDTO>> getCitasByNegocioId(@PathVariable Integer negocioId) {
        List<Cita> citas = citaService.getCitasByNegocioId(negocioId);
        List<CitaResponseDTO> citaDTOs = citas.stream()
                .map(CitaResponseDTO::new) 
                .collect(Collectors.toList());
        return ResponseEntity.ok(citaDTOs);
    }

    @PostMapping
    public ResponseEntity<CitaResponseDTO> createCita(@Valid @RequestBody CitaRequestDTO dto) {
        Cita cita = mapDtoToEntity(dto);
        Cita created = citaService.createCita(cita);
        return ResponseEntity.status(201).body(new CitaResponseDTO(created));
    }

  
    @PutMapping("/{id}")
    public ResponseEntity<CitaResponseDTO> updateCita(@PathVariable Integer id, @Valid @RequestBody CitaRequestDTO dto) {
        Cita citaDetails = mapDtoToEntity(dto);
        Cita updated = citaService.updateCita(id, citaDetails);
        
        if (updated != null) {
            return ResponseEntity.ok(new CitaResponseDTO(updated));
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCita(@PathVariable Integer id) {
        citaService.deleteCita(id);
        return ResponseEntity.noContent().build();
    }

    // Método auxiliar para convertir lo que envía Angular (DTO) a Entidad de Base de Datos
    private Cita mapDtoToEntity(CitaRequestDTO dto) {
        Cita cita = new Cita();
        
        Usuario cliente = new Usuario();
        
        cliente.setId(dto.getClienteId()); 
        cita.setCliente(cliente);

        Negocio negocio = new Negocio();
        negocio.setId(dto.getNegocioId());
        cita.setNegocio(negocio);

        Profesional profesional = new Profesional();
        profesional.setId(dto.getProfesionalId());
        cita.setProfesional(profesional);

        Servicio servicio = new Servicio();
        servicio.setId(dto.getServicioId());
        cita.setServicio(servicio);

        // Fechas y datos simples
        if (dto.getFechaHoraInicio() != null) {
            cita.setFechaHoraInicio(LocalDateTime.parse(dto.getFechaHoraInicio()));
        }
        if (dto.getFechaHoraFin() != null) {
            cita.setFechaHoraFin(LocalDateTime.parse(dto.getFechaHoraFin()));
        }
        
        cita.setEstado(dto.getEstado());
        cita.setPrecioFinal(dto.getPrecioFinal());
        cita.setNotasPromocion(dto.getNotasPromocion());
        
        return cita;
    }
}