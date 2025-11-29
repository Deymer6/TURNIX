package com.turnix.turnix_backend.controller;

import com.turnix.turnix_backend.dto.UsuarioRequestDTO;
import com.turnix.turnix_backend.dto.UsuarioResponseDTO;
import com.turnix.turnix_backend.model.Role;
import com.turnix.turnix_backend.model.Usuario;
import com.turnix.turnix_backend.repository.RoleRepository;
import com.turnix.turnix_backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/usuarios") 
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    @GetMapping
    public List<UsuarioResponseDTO> getAllUsuarios() {
        return usuarioService.getAllUsuarios().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

   @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> getUsuarioById(@PathVariable Integer id) {
        return usuarioService.getUsuarioById(id)
                .map(this::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

   
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> createUsuario(@Valid @RequestBody UsuarioRequestDTO usuarioDto) {
        if (usuarioService.getUsuarioByEmail(usuarioDto.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null); 
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(usuarioDto.getNombre());
        usuario.setApellido(usuarioDto.getApellido());
        usuario.setEmail(usuarioDto.getEmail());
        usuario.setTelefono(usuarioDto.getTelefono());
        usuario.setPasswordHash(passwordEncoder.encode(usuarioDto.getPassword()));

        

        Usuario createdUsuario = usuarioService.createUsuario(usuario);

        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(createdUsuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Integer id) {
        usuarioService.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }

    private UsuarioResponseDTO convertToDto(Usuario usuario) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(usuario.getId().longValue());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setEmail(usuario.getEmail());
        dto.setTelefono(usuario.getTelefono());
        dto.setRol(usuario.getRoles().stream().findFirst().map(Role::getName).orElse(null));
        return dto;
    }
}