package com.turnix.turnix_backend.repository;

import com.turnix.turnix_backend.model.ExcepcionHorario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExcepcionHorarioRepository extends JpaRepository<ExcepcionHorario, Long> {
}