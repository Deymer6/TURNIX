package com.turnix.turnix_backend.controller;

import com.turnix.turnix_backend.dto.LoginRequestDTO;
import com.turnix.turnix_backend.dto.LoginResponseDTO;
import com.turnix.turnix_backend.dto.UsuarioRequestDTO;
import com.turnix.turnix_backend.dto.UsuarioResponseDTO;
import com.turnix.turnix_backend.model.Usuario;

import com.turnix.turnix_backend.service.UserDetailsServiceImpl;
import com.turnix.turnix_backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.turnix.turnix_backend.util.JwtUtil;
@RestController
@RequestMapping("/api/auth") // ✅ Todo lo de auth va aquí
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    // 🔹 LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new Exception("Usuario o contraseña incorrectos", e);
        }

        // Generar Token
        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        // Obtener datos del usuario para el frontend
        Usuario usuario = usuarioService.getUsuarioByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new Exception("Usuario no encontrado"));

        return ResponseEntity.ok(new LoginResponseDTO(
            jwt,
            usuario.getId().longValue(),
            usuario.getNombre(),
            usuario.getEmail(),
            usuario.getRol()
        ));
    }

    // 🔹 REGISTRO (Movido aquí desde UsuarioController)
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UsuarioRequestDTO usuarioDto) {
        if (usuarioService.getUsuarioByEmail(usuarioDto.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El correo ya está registrado.");
        }
        try {
            // Mapeo manual DTO -> Entidad
            Usuario usuario = new Usuario();
            usuario.setNombre(usuarioDto.getNombre());
            usuario.setApellido(usuarioDto.getApellido());
            usuario.setEmail(usuarioDto.getEmail());
            usuario.setTelefono(usuarioDto.getTelefono());
            usuario.setPassword(usuarioDto.getPassword());
            usuario.setRol(usuarioDto.getRol());

            Usuario created = usuarioService.createUsuario(usuario);

            // Mapeo manual Entidad -> DTO
            UsuarioResponseDTO resp = new UsuarioResponseDTO();
            Long idLong = created.getId() == null ? null : created.getId().longValue();
            resp.setId(idLong);
            resp.setNombre(created.getNombre());
            resp.setApellido(created.getApellido());
            resp.setEmail(created.getEmail());
            resp.setTelefono(created.getTelefono());
            resp.setRol(created.getRol());

            return ResponseEntity.status(HttpStatus.CREATED).body(resp);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}