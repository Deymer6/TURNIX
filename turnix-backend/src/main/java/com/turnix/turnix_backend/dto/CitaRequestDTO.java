package com.turnix.turnix_backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CitaRequestDTO {
    // ✅ CAMBIO: Long -> Integer (Para coincidir con el resto del sistema)
    @NotNull
    @Positive(message = "El ID del cliente debe ser un número positivo")
    private Integer clienteId;

    @NotNull
    @Positive(message = "El ID del negocio debe ser un número positivo")
    private Integer negocioId;

    @NotNull
    @Positive(message = "El ID del profesional debe ser un número positivo")
    private Integer profesionalId;

    @NotNull
    @Positive(message = "El ID del servicio debe ser un número positivo")
    private Integer servicioId;

    @NotBlank
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$", message = "La fecha de inicio debe tener el formato yyyy-MM-dd'T'HH:mm:ss")
    private String fechaHoraInicio;

    @NotBlank
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$", message = "La fecha de fin debe tener el formato yyyy-MM-dd'T'HH:mm:ss")
    private String fechaHoraFin; 

    @NotBlank
    @Size(max = 50, message = "El estado no puede tener más de 50 caracteres")
    private String estado;

    @NotNull
    @PositiveOrZero(message = "El precio final no puede ser negativo")
    private BigDecimal precioFinal;

    private String notasPromocion;
}