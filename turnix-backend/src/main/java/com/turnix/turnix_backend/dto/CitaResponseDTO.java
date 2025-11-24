package com.turnix.turnix_backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CitaResponseDTO {
    private Long id;
    private Long clienteId;
    private Long negocioId;
    private Long profesionalId;
    private Long servicioId;
    private LocalDateTime fechaHoraInicio;
    private LocalDateTime fechaHoraFin;
    private String estado;
    private BigDecimal precioFinal;
    private String notasPromocion;
}
