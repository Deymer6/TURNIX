package com.turnix.turnix_backend.repository;

import com.turnix.turnix_backend.model.Promocion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromocionRepository extends JpaRepository<Promocion, Long> {
    List<Promocion> findByNegocio_Id(Integer negocioId);
}