package com.turnix.turnix_backend.service;

import com.turnix.turnix_backend.model.Usuario;
import com.turnix.turnix_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> getUsuarioById(Integer id) {
        return usuarioRepository.findById(id);
    }

    public Usuario createUsuario(Usuario usuario) {
        try {
            
            return usuarioRepository.save(usuario);
        } catch (DataIntegrityViolationException e) {
            
            throw new IllegalArgumentException("Error de integridad de datos al crear el usuario: " + e.getMessage());
        }
    }

    public void deleteUsuario(Integer id) {
        usuarioRepository.deleteById(id);
    }

    public Optional<Usuario> getUsuarioByEmail(String email) {
        return Optional.ofNullable(usuarioRepository.findByEmail(email));
    }
}