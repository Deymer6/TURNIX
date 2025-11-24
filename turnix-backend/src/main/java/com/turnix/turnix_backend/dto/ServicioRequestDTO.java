package com.turnix.turnix_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ServicioRequestDTO {

    @NotNull
    @Positive(message = "El ID del negocio debe ser un número positivo")
    private Long negocioId;

    @NotBlank
    @Size(max = 100, message = "El nombre del servicio no puede exceder los 100 caracteres")
    private String nombreServicio;

    @NotNull
    @PositiveOrZero
    private BigDecimal precio;

    @NotNull
    private Integer duracionEstimada;
}
