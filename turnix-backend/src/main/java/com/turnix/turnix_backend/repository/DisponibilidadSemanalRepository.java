package com.turnix.turnix_backend.repository;

import com.turnix.turnix_backend.model.DisponibilidadSemanal;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DisponibilidadSemanalRepository extends JpaRepository<DisponibilidadSemanal, Long> {
    List<DisponibilidadSemanal> findByProfesional_Id(Integer profesionalId);

    
    List<DisponibilidadSemanal> findByProfesional_IdAndDiaSemana(Integer profesionalId, Integer diaSemana);
}