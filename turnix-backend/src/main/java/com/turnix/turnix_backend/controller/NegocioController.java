package com.turnix.turnix_backend.controller;

import com.turnix.turnix_backend.model.Cita;
import com.turnix.turnix_backend.model.Negocio;
import com.turnix.turnix_backend.model.Role;
import com.turnix.turnix_backend.model.Usuario;
import com.turnix.turnix_backend.repository.RoleRepository;
import com.turnix.turnix_backend.repository.UsuarioRepository;
import com.turnix.turnix_backend.service.CitaService;
import com.turnix.turnix_backend.service.NegocioService;
import com.turnix.turnix_backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.HashSet;
import java.util.Set;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/negocios")
@Validated
@EnableMethodSecurity(prePostEnabled = true)
public class NegocioController {

    @Autowired
    private NegocioService negocioService;

    @Autowired
    private CitaService citaService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Negocio> getAllNegocios() {
        return negocioService.getAllNegocios();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Negocio> getNegocioById(@PathVariable Long id) {
        Optional<Negocio> negocio = negocioService.getNegocioById(id);
        return negocio.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{negocioId}/citas")
    @PreAuthorize("hasRole('ADMIN')") 
    public List<Cita> getCitasByNegocioId(@PathVariable Long negocioId, Principal principal) {
        String userEmail = principal.getName();
        Usuario authenticatedUser = usuarioService.getUsuarioByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));

        Optional<Negocio> ownedNegocio = negocioService.getNegocioByDueno(authenticatedUser);

        if (ownedNegocio.isEmpty() || !Long.valueOf(ownedNegocio.get().getId()).equals(negocioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acceso denegado. No eres el propietario de este negocio o el negocio no existe.");
        }

        return citaService.getCitasByNegocioId(negocioId.intValue());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") 
    public Negocio createNegocio(@Valid @RequestBody Negocio negocio, Principal principal) {
        // 1. Obtener el usuario autenticado
        String userEmail = principal.getName();
        Usuario authenticatedUser = usuarioService.getUsuarioByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));

        
        if (negocioService.getNegocioByDueno(authenticatedUser).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El usuario ya es dueño de un negocio.");
        }

       
        negocio.setDueno(authenticatedUser);

       
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Rol de administrador no encontrado."));
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Rol de usuario no encontrado."));

       
        Set<Role> updatedRoles = new HashSet<>(authenticatedUser.getRoles());
        updatedRoles.remove(userRole); 
        updatedRoles.add(adminRole); 
        authenticatedUser.setRoles(updatedRoles);
        usuarioRepository.save(authenticatedUser);

        
        return negocioService.createNegocio(negocio);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNegocio(@PathVariable Long id) {
        negocioService.deleteNegocio(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-business")
    @PreAuthorize("hasRole('ADMIN')") 
    public ResponseEntity<Negocio> getMyBusiness(Principal principal) {
        String userEmail = principal.getName();
        Usuario authenticatedUser = usuarioService.getUsuarioByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));

        Optional<Negocio> negocio = negocioService.getNegocioByDueno(authenticatedUser);
        return negocio.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }
}