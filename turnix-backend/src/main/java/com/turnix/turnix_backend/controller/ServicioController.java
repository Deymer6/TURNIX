package com.turnix.turnix_backend.controller;

import com.turnix.turnix_backend.dto.ServicioRequestDTO;
import com.turnix.turnix_backend.dto.ServicioResponseDTO;
import com.turnix.turnix_backend.model.Negocio;
import com.turnix.turnix_backend.model.Profesional;
import com.turnix.turnix_backend.model.Servicio;
import com.turnix.turnix_backend.model.Usuario;
import com.turnix.turnix_backend.service.NegocioService;
import com.turnix.turnix_backend.service.ServicioService;
import com.turnix.turnix_backend.service.UsuarioService;
import jakarta.validation.Valid;
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
public class ServicioController {

    @Autowired
    private ServicioService servicioService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private NegocioService negocioService;

    @GetMapping("/servicios")
    public List<Servicio> getAllServicios() {
        return servicioService.getAllServicios();
    }

    @GetMapping("/servicios/{id}")
    public ResponseEntity<Servicio> getServicioById(@PathVariable Long id) {
        Optional<Servicio> servicio = servicioService.getServicioById(id);
        return servicio.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/servicios/negocio/{negocioId}")
    public List<Servicio> getServiciosByNegocio(@PathVariable Integer negocioId) { // O Long
        System.out.println("ServicioController: Received request for servicios/negocio with ID: " + negocioId);
        return servicioService.getServiciosByNegocioId(negocioId);
    }

    @GetMapping("/negocios/{negocioId}/servicios")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Servicio> getServiciosByNegocioId(@PathVariable Integer negocioId, Principal principal) {
        String userEmail = principal.getName();
        Usuario authenticatedUser = usuarioService.getUsuarioByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));

        Optional<Negocio> ownedNegocio = negocioService.getNegocioByDueno(authenticatedUser);

        if (ownedNegocio.isEmpty() || !ownedNegocio.get().getId().equals(negocioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acceso denegado. No eres el propietario de este negocio o el negocio no existe.");
        }

        return servicioService.getServiciosByNegocioId(negocioId);
    }

    @PostMapping("/servicios")
    public ResponseEntity<ServicioResponseDTO> createServicio(@Valid @RequestBody ServicioRequestDTO dto) {
        Servicio servicio = new Servicio();
    Negocio negocio = new Negocio();
   
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

    @PutMapping("/servicios/{id}")
    public ResponseEntity<Servicio> updateServicio(@PathVariable Long id, @RequestBody ServicioRequestDTO dto) {
     
        Optional<Servicio> existente = servicioService.getServicioById(id);
        
        if (existente.isPresent()) {
            Servicio servicio = existente.get();
            
            servicio.setNombreServicio(dto.getNombreServicio());
            servicio.setPrecio(dto.getPrecio());
            servicio.setDuracionEstimada(dto.getDuracionEstimada());
            
            
            Servicio actualizado = servicioService.createServicio(servicio);
            return ResponseEntity.ok(actualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    
}