package com.turnix.turnix_backend.repository;

import com.turnix.turnix_backend.model.GaleriaNegocio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GaleriaNegocioRepository extends JpaRepository<GaleriaNegocio, Integer> {
    List<GaleriaNegocio> findByNegocio_Id(Integer negocioId);
}