package com.turnix.turnix_backend.service;

import com.turnix.turnix_backend.model.GaleriaNegocio;
import com.turnix.turnix_backend.repository.GaleriaNegocioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GaleriaNegocioService {

    @Autowired
    private GaleriaNegocioRepository galeriaNegocioRepository;

    public List<GaleriaNegocio> getAllGalerias() {
        return galeriaNegocioRepository.findAll();
    }

    public Optional<GaleriaNegocio> getGaleriaById(Long id) {
        return galeriaNegocioRepository.findById(id);
    }

    public GaleriaNegocio createGaleria(GaleriaNegocio galeria) {
        return galeriaNegocioRepository.save(galeria);
    }

    public void deleteGaleria(Long id) {
        galeriaNegocioRepository.deleteById(id);
    }

    public List<GaleriaNegocio> getGaleriasByNegocioId(Long negocioId) {
        return galeriaNegocioRepository.findByNegocio_Id(negocioId);
    }
}