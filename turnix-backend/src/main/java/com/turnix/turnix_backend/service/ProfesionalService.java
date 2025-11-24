package com.turnix.turnix_backend.service;

import com.turnix.turnix_backend.model.Profesional;
import com.turnix.turnix_backend.repository.ProfesionalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfesionalService {

    @Autowired
    private ProfesionalRepository profesionalRepository;

    public List<Profesional> getAllProfesionales() {
        return profesionalRepository.findAll();
    }

    public Optional<Profesional> getProfesionalById(Long id) {
        return profesionalRepository.findById(id);
    }

    public Profesional createProfesional(Profesional profesional) {
        return profesionalRepository.save(profesional);
    }

    public void deleteProfesional(Long id) {
        profesionalRepository.deleteById(id);
    }
    public List<Profesional> getProfesionalesByNegocioId(Integer negocioId) { // O Long
    return profesionalRepository.findByNegocio_Id(negocioId);
}
}