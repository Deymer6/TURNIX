package com.turnix.turnix_backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ServicioResponseDTO {
    private Long id;
    private Long negocioId;
    private String nombreServicio;
    private BigDecimal precio;
    private Integer duracionEstimada;
}
