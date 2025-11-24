package com.turnix.turnix_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private String jwt;
    private Long id;
    private String nombre;
    private String email;
    private String rol;
}
