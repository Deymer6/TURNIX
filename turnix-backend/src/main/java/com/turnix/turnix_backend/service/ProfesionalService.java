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

   
    public Optional<Profesional> getProfesionalById(Integer id) {
        return profesionalRepository.findById(id);
    }

    public Profesional createProfesional(Profesional profesional) {
        return profesionalRepository.save(profesional);
    }

    
    public Profesional updateProfesional(Integer id, Profesional profesionalDetails) {
        return profesionalRepository.findById(id).map(profesional -> {
            profesional.setNombre(profesionalDetails.getNombre());
            profesional.setApellido(profesionalDetails.getApellido());
            profesional.setEspecialidad(profesionalDetails.getEspecialidad());
            profesional.setActivo(profesionalDetails.getActivo());
            
            return profesionalRepository.save(profesional);
        }).orElse(null);
    }

    
    public void deleteProfesional(Integer id) {
        profesionalRepository.deleteById(id);
    }

    public List<Profesional> getProfesionalesByNegocioId(Integer negocioId) {
        return profesionalRepository.findByNegocio_Id(negocioId);
    }
}