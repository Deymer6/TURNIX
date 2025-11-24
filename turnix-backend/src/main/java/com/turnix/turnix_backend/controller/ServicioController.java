package com.turnix.turnix_backend.controller;

import com.turnix.turnix_backend.dto.ServicioRequestDTO;
import com.turnix.turnix_backend.dto.ServicioResponseDTO;
import com.turnix.turnix_backend.model.Negocio;
import com.turnix.turnix_backend.model.Servicio;
import com.turnix.turnix_backend.service.ServicioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api") // Changed to /api to accommodate /api/negocios/{negocioId}/servicios
public class ServicioController {

    @Autowired
    private ServicioService servicioService;

    @GetMapping("/servicios")
    public List<Servicio> getAllServicios() {
        return servicioService.getAllServicios();
    }

    @GetMapping("/servicios/{id}")
    public ResponseEntity<Servicio> getServicioById(@PathVariable Long id) {
        Optional<Servicio> servicio = servicioService.getServicioById(id);
        return servicio.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/negocio/{negocioId}")
    public List<Servicio> getServiciosByNegocio(@PathVariable Integer negocioId) { // O Long
    return servicioService.getServiciosByNegocioId(negocioId);
}

    @GetMapping("/negocios/{negocioId}/servicios")
    public List<Servicio> getServiciosByNegocioId(@PathVariable Integer negocioId) {
        return servicioService.getServiciosByNegocioId(negocioId);
    }

    @PostMapping("/servicios")
    public ResponseEntity<ServicioResponseDTO> createServicio(@Valid @RequestBody ServicioRequestDTO dto) {
        Servicio servicio = new Servicio();
    Negocio negocio = new Negocio();
    // model uses Integer for id in some classes; convert safely
    negocio.setId(dto.getNegocioId() == null ? null : dto.getNegocioId().intValue());
        servicio.setNegocio(negocio);
        servicio.setNombreServicio(dto.getNombreServicio());
        servicio.setPrecio(dto.getPrecio());
        servicio.setDuracionEstimada(dto.getDuracionEstimada());

        Servicio created = servicioService.createServicio(servicio);

        ServicioResponseDTO resp = new ServicioResponseDTO();
    resp.setId(created.getId() == null ? null : created.getId().longValue());
    resp.setNegocioId(created.getNegocio() != null && created.getNegocio().getId() != null ? created.getNegocio().getId().longValue() : null);
        resp.setNombreServicio(created.getNombreServicio());
        resp.setPrecio(created.getPrecio());
        resp.setDuracionEstimada(created.getDuracionEstimada());

        return ResponseEntity.status(201).body(resp);
    }

    @DeleteMapping("/servicios/{id}")
    public ResponseEntity<Void> deleteServicio(@PathVariable Long id) {
        servicioService.deleteServicio(id);
        return ResponseEntity.noContent().build();
    }
}