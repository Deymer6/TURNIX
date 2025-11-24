package com.turnix.turnix_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Usuario")
@Data
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Usuario")
    private Integer id;

    @NotBlank
    @Size(max = 100)
    @Column(name = "Nombre", nullable = false, length = 100)
    private String nombre;

    @NotBlank
    @Size(max = 100)
    @Column(name = "Apellido", nullable = false, length = 100)
    private String apellido;

    @NotBlank
    @Email
    @Column(name = "Email", nullable = false, unique = true, length = 255)
    private String email;

    @Size(max = 20)
    @Column(name = "Telefono", length = 20)
    private String telefono;

    @NotBlank
    @Column(name = "Password_Hash", nullable = false)
    private String passwordHash;

    @NotBlank
    @Size(max = 10)
    @Column(name = "Rol", nullable = false, length = 10)
    private String rol;

    @Transient
    private String password;
}