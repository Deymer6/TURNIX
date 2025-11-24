package com.turnix.turnix_backend.repository;

import com.turnix.turnix_backend.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {
    List<Cita> findByNegocio_Id(Integer negocioId);
    List<Cita> findByCliente_Id(Integer clienteId);
}