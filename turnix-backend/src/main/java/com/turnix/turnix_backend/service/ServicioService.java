package com.turnix.turnix_backend.service;

import com.turnix.turnix_backend.model.Servicio;
import com.turnix.turnix_backend.repository.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServicioService {

    @Autowired
    private ServicioRepository servicioRepository;

    public List<Servicio> getAllServicios() {
        return servicioRepository.findAll();
    }

    public Optional<Servicio> getServicioById(Long id) {
        return servicioRepository.findById(id);
    }

    public List<Servicio> getServiciosByNegocioId(Integer negocioId) {
        return servicioRepository.findByNegocio_Id(negocioId);
    }

    public Servicio createServicio(Servicio servicio) {
        return servicioRepository.save(servicio);
    }

    public void deleteServicio(Long id) {
        servicioRepository.deleteById(id);
    }
}