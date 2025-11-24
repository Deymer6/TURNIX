package com.turnix.turnix_backend.service;

import com.turnix.turnix_backend.model.ExcepcionHorario;
import com.turnix.turnix_backend.repository.ExcepcionHorarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExcepcionHorarioService {

    @Autowired
    private ExcepcionHorarioRepository excepcionHorarioRepository;

    public List<ExcepcionHorario> getAllExcepciones() {
        return excepcionHorarioRepository.findAll();
    }

    public Optional<ExcepcionHorario> getExcepcionById(Long id) {
        return excepcionHorarioRepository.findById(id);
    }

    public ExcepcionHorario createExcepcion(ExcepcionHorario excepcion) {
        return excepcionHorarioRepository.save(excepcion);
    }

    public void deleteExcepcion(Long id) {
        excepcionHorarioRepository.deleteById(id);
    }
}