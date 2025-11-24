package com.turnix.turnix_backend.repository;

import com.turnix.turnix_backend.model.DisponibilidadSemanal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DisponibilidadSemanalRepository extends JpaRepository<DisponibilidadSemanal, Long> {
}