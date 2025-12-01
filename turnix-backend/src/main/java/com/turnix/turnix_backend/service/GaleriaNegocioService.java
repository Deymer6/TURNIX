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


    public Optional<GaleriaNegocio> getGaleriaById(Integer id) {
        return galeriaNegocioRepository.findById(id);
    }

    public GaleriaNegocio createGaleria(GaleriaNegocio galeria) {
        
        galeria.setId(null); 
        return galeriaNegocioRepository.save(galeria);
    }

  
    public void deleteGaleria(Integer id) {
        galeriaNegocioRepository.deleteById(id);
    }


    public List<GaleriaNegocio> getGaleriasByNegocioId(Integer negocioId) {
        return galeriaNegocioRepository.findByNegocio_Id(negocioId);
    }
}