package com.turnix.turnix_backend.service;

import com.turnix.turnix_backend.model.DisponibilidadSemanal;
import com.turnix.turnix_backend.repository.DisponibilidadSemanalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DisponibilidadSemanalService {

    @Autowired
    private DisponibilidadSemanalRepository disponibilidadSemanalRepository;

    public List<DisponibilidadSemanal> getAllDisponibilidades() {
        return disponibilidadSemanalRepository.findAll();
    }

    public Optional<DisponibilidadSemanal> getDisponibilidadById(Long id) {
        return disponibilidadSemanalRepository.findById(id);
    }

    public DisponibilidadSemanal createDisponibilidad(DisponibilidadSemanal disponibilidad) {
        return disponibilidadSemanalRepository.save(disponibilidad);
    }

    public void deleteDisponibilidad(Long id) {
        disponibilidadSemanalRepository.deleteById(id);
    }
}