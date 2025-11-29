package com.turnix.turnix_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UsuarioRequestDTO {

    @NotBlank
    @Size(max = 100)
    private String nombre;

    @NotBlank
    @Size(max = 100)
    private String apellido;

    @NotBlank
    @Email
    private String email;

    @NotBlank(message = "El teléfono no debe estar vacío")
    @Size(min = 9, max = 9, message = "El teléfono debe tener 9 dígitos")
    @Pattern(regexp = "^[0-9]{9}$", message = "El teléfono debe contener solo 9 dígitos numéricos")
    private String telefono;

    @NotBlank
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;

}
