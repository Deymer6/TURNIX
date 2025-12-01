package com.turnix.turnix_backend.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private Long id;
    private String nombre;
    private String email;
    private String rol;
    private boolean hasNegocio;
    private List<Long> negocioIds;
}
