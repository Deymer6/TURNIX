package com.turnix.turnix_backend.repository;

import com.turnix.turnix_backend.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Integer> {
    List<Cita> findByNegocio_Id(Integer negocioId);
    List<Cita> findByCliente_Id(Integer clienteId);

    List<Cita> findByNegocio_IdAndEstado(Integer negocioId, String estado);

    
    List<Cita> findByNegocio_IdAndProfesional_Id(Integer negocioId, Integer profesionalId);


    List<Cita> findByNegocio_IdAndFechaHoraInicioBetween(Integer negocioId, LocalDateTime start, LocalDateTime end);

    // En CitaRepository.java
    @Query("SELECT c FROM Cita c WHERE c.profesional.id = :profesionalId AND CAST(c.fechaHoraInicio AS DATE) = CAST(:fecha AS DATE)")
    List<Cita> findCitasPorProfesionalYFecha(@Param("profesionalId") Integer profesionalId, @Param("fecha") LocalDate fecha);
}