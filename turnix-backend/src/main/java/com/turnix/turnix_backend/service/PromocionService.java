package com.turnix.turnix_backend.service;

import com.turnix.turnix_backend.model.Promocion;
import com.turnix.turnix_backend.repository.PromocionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PromocionService {

    @Autowired
    private PromocionRepository promocionRepository;

    public List<Promocion> getAllPromociones() {
        return promocionRepository.findAll();
    }

    public Optional<Promocion> getPromocionById(Long id) {
        return promocionRepository.findById(id);
    }

    public Promocion createPromocion(Promocion promocion) {
        return promocionRepository.save(promocion);
    }

    public void deletePromocion(Long id) {
        promocionRepository.deleteById(id);
    }

    public List<Promocion> getPromocionesByNegocioId(Integer negocioId) {
        return promocionRepository.findByNegocio_Id(negocioId);
    }
}