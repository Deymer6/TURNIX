package com.turnix.turnix_backend.service;

import com.turnix.turnix_backend.model.Cita;
import com.turnix.turnix_backend.repository.CitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CitaService {

    @Autowired
    private CitaRepository citaRepository;

    public List<Cita> getAllCitas() {
        return citaRepository.findAll();
    }

   
    public Optional<Cita> getCitaById(Integer id) {
        return citaRepository.findById(id);
    }

    public Cita createCita(Cita cita) {

        cita.setId(null); 
        return citaRepository.save(cita);
    }

    
    public void deleteCita(Integer id) {
        citaRepository.deleteById(id);
    }

    
    public Cita updateCita(Integer id, Cita citaDetails) {
        return citaRepository.findById(id).map(cita -> {
            cita.setFechaHoraInicio(citaDetails.getFechaHoraInicio());
            cita.setFechaHoraFin(citaDetails.getFechaHoraFin());
            cita.setEstado(citaDetails.getEstado());
            cita.setPrecioFinal(citaDetails.getPrecioFinal());
            cita.setNotasPromocion(citaDetails.getNotasPromocion());
            
            
            if(citaDetails.getProfesional() != null) cita.setProfesional(citaDetails.getProfesional());
            if(citaDetails.getServicio() != null) cita.setServicio(citaDetails.getServicio());
            if(citaDetails.getCliente() != null) cita.setCliente(citaDetails.getCliente());
            
            return citaRepository.save(cita);
        }).orElse(null);
    }

    public List<Cita> getCitasByNegocioId(Integer negocioId) {
        return citaRepository.findByNegocio_Id(negocioId);
    }
}