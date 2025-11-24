package com.turnix.turnix_backend.service;

import com.turnix.turnix_backend.model.Negocio;
import com.turnix.turnix_backend.repository.NegocioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NegocioService {

    @Autowired
    private NegocioRepository negocioRepository;

    public List<Negocio> getAllNegocios() {
        return negocioRepository.findAll();
    }

    public Optional<Negocio> getNegocioById(Long id) {
        return negocioRepository.findById(id);
    }

    public Negocio createNegocio(Negocio negocio) {
        return negocioRepository.save(negocio);
    }

    public void deleteNegocio(Long id) {
        negocioRepository.deleteById(id);
    }
}