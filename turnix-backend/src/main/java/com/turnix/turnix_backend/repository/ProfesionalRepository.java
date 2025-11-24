package com.turnix.turnix_backend.repository;

import com.turnix.turnix_backend.model.Profesional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProfesionalRepository extends JpaRepository<Profesional, Long> {
    List<Profesional> findByNegocio_Id(Integer negocioId);
}