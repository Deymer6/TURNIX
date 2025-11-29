package com.turnix.turnix_backend.repository;

import com.turnix.turnix_backend.model.Negocio;
import com.turnix.turnix_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NegocioRepository extends JpaRepository<Negocio, Long> {
    boolean existsByDuenoId(Integer duenoId);
    Optional<Negocio> findByDueno(Usuario dueno);
    Optional<Negocio> findByDuenoId(Integer duenoId);
    List<Negocio> findAllByDuenoId(Integer duenoId);
}