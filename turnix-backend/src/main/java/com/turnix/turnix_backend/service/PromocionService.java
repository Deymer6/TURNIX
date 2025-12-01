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

    public Optional<Promocion> getPromocionById(Integer id) {
        return promocionRepository.findById(id);
    }

    public Promocion createPromocion(Promocion promocion) {
        promocion.setId(null); 
        return promocionRepository.save(promocion);
    }
    public void deletePromocion(Integer id) {
        promocionRepository.deleteById(id);
    }

    public List<Promocion> getPromocionesByNegocioId(Integer negocioId) {
        return promocionRepository.findByNegocio_Id(negocioId);
    }
    public Promocion updatePromocion(Integer id, Promocion detalles) {
        return promocionRepository.findById(id).map(promo -> {
            promo.setTitulo(detalles.getTitulo());
            promo.setDescripcion(detalles.getDescripcion());
            promo.setFechaInicio(detalles.getFechaInicio());
            promo.setFechaFin(detalles.getFechaFin());
            
            
            promo.setActiva(detalles.getActiva()); 
            
            return promocionRepository.save(promo);
        }).orElse(null);
    }
}