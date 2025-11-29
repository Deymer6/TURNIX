package com.turnix.turnix_backend.controller;

import com.turnix.turnix_backend.dto.LoginRequestDTO;
import com.turnix.turnix_backend.dto.LoginResponseDTO;
import com.turnix.turnix_backend.dto.UsuarioRequestDTO;
import com.turnix.turnix_backend.dto.UsuarioResponseDTO;
import com.turnix.turnix_backend.model.Role;
import com.turnix.turnix_backend.model.Usuario;
import com.turnix.turnix_backend.repository.RoleRepository;
import com.turnix.turnix_backend.repository.NegocioRepository;
import com.turnix.turnix_backend.service.UserDetailsServiceImpl;
import com.turnix.turnix_backend.service.UsuarioService;
import com.turnix.turnix_backend.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth") 
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private NegocioRepository negocioRepository;


    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new Exception("Usuario o contraseña incorrectos", e);
        }

       
        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        
        Usuario usuario = usuarioService.getUsuarioByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new Exception("Usuario no encontrado"));

        String userRole = usuario.getRoles().stream()
                .findFirst()
                .map(Role::getName)
                .orElse(null);

        List<Long> negocioIds = negocioRepository.findAllByDuenoId(usuario.getId())
                                                .stream()
                                                .map(negocio -> negocio.getId().longValue())
                                                .collect(Collectors.toList());


        return ResponseEntity.ok(new LoginResponseDTO(
            jwt,
            usuario.getId().longValue(),
            usuario.getNombre(),
            usuario.getEmail(),
            userRole,
            !negocioIds.isEmpty(), 
            negocioIds
        ));
    }

    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UsuarioRequestDTO usuarioDto) {
        if (usuarioService.getUsuarioByEmail(usuarioDto.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El correo ya está registrado.");
        }
        try {
            Usuario usuario = new Usuario();
            usuario.setNombre(usuarioDto.getNombre());
            usuario.setApellido(usuarioDto.getApellido());
            usuario.setEmail(usuarioDto.getEmail());
            usuario.setTelefono(usuarioDto.getTelefono());
            usuario.setPasswordHash(passwordEncoder.encode(usuarioDto.getPassword()));

            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Rol de usuario no encontrado."));

            Set<Role> roles = new HashSet<>();
            roles.add(userRole);
            usuario.setRoles(roles);

            Usuario created = usuarioService.createUsuario(usuario);

            
            UsuarioResponseDTO resp = new UsuarioResponseDTO();
            resp.setId(created.getId().longValue());
            resp.setNombre(created.getNombre());
            resp.setApellido(created.getApellido());
            resp.setEmail(created.getEmail());
            resp.setTelefono(created.getTelefono());

            String roleName = created.getRoles().stream()
                    .findFirst()
                    .map(Role::getName)
                    .orElse(null);
            resp.setRol(roleName);

            return ResponseEntity.status(HttpStatus.CREATED).body(resp);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}