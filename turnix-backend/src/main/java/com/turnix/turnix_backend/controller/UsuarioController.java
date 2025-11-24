package com.turnix.turnix_backend.controller;

import com.turnix.turnix_backend.dto.UsuarioRequestDTO;
import com.turnix.turnix_backend.dto.UsuarioResponseDTO;
import com.turnix.turnix_backend.model.Usuario;
import com.turnix.turnix_backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/usuarios") // ✅ Solo gestión de usuarios
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return usuarioService.getAllUsuarios();
    }

   @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Integer id) {
        // Usamos .map() para transformar el Optional en una respuesta HTTP
        return usuarioService.getUsuarioById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Este método se queda por si un Admin quiere crear usuarios manualmente sin loguearse
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> createUsuario(@Valid @RequestBody UsuarioRequestDTO usuarioDto) {
        Usuario usuario = new Usuario();
        usuario.setNombre(usuarioDto.getNombre());
        usuario.setApellido(usuarioDto.getApellido());
        usuario.setEmail(usuarioDto.getEmail());
        usuario.setTelefono(usuarioDto.getTelefono());
        usuario.setPassword(usuarioDto.getPassword());
        usuario.setRol(usuarioDto.getRol());

        Usuario createdUsuario = usuarioService.createUsuario(usuario);

        UsuarioResponseDTO resp = new UsuarioResponseDTO();
        Long idLong = createdUsuario.getId() == null ? null : createdUsuario.getId().longValue();
        resp.setId(idLong);
        resp.setNombre(createdUsuario.getNombre());
        resp.setApellido(createdUsuario.getApellido());
        resp.setEmail(createdUsuario.getEmail());
        resp.setTelefono(createdUsuario.getTelefono());
        resp.setRol(createdUsuario.getRol());

        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Integer id) {
        usuarioService.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }
}