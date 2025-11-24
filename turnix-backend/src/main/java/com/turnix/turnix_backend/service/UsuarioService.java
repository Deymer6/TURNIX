package com.turnix.turnix_backend.service;

import com.turnix.turnix_backend.model.Usuario;
import com.turnix.turnix_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> getUsuarioById(Integer id) {
        return usuarioRepository.findById(id);
    }

    public Usuario createUsuario(Usuario usuario) {
        try {
            // Normalizar y validar rol antes de persistir
            String normalizedRole = normalizeRole(usuario.getRol());
            usuario.setRol(normalizedRole);

            // Generar el hash de la contraseña
            usuario.setPasswordHash(passwordEncoder.encode(usuario.getPassword()));
            return usuarioRepository.save(usuario);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Error al crear el usuario: " + e.getMessage());
        }
    }

    private String normalizeRole(String rol) {
        if (rol == null) {
            throw new IllegalArgumentException("El rol es obligatorio");
        }
        String r = rol.trim().toLowerCase();
        // Mapear sinónimos y variantes al conjunto permitido por la BD
        switch (r) {
            case "user":
            case "usuario":
            case "cliente":
            case "client":
                return "USER";
            case "admin":
            case "administrador":
            case "dueño":
            case "dueno":
            case "owner":
                return "ADMIN";
            default:
                throw new IllegalArgumentException("Rol inválido: '" + rol + "'. Valores permitidos (alias): USER, ADMIN, Cliente, Administrador, Dueño.");
        }
    }

    public void deleteUsuario(Integer id) {
        usuarioRepository.deleteById(id);
    }

    public Optional<Usuario> getUsuarioByEmail(String email) {
        return Optional.ofNullable(usuarioRepository.findByEmail(email));
    }
}