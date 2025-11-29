package com.turnix.turnix_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;

@Entity
@Table(name = "Negocio")
@Data
@NoArgsConstructor
public class Negocio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Negocio")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Dueño", nullable = false)
    @JsonIgnore
    private Usuario dueno;

    @Column(name = "Nombre_Negocio", nullable = false, length = 150)
    private String nombreNegocio;

    @NotBlank(message = "La dirección no puede estar vacía")
    @Column(name = "Direccion", length = 255)
    private String direccion;

    @Column(name = "Telefono_Negocio", length = 20)
    private String telefonoNegocio;

    @Column(name = "Descripcion")
    private String descripcion;

    @NotNull(message = "El horario de apertura no puede estar vacío")
    @Column(name = "Horario_Apertura", columnDefinition = "time(0)")
    private LocalTime horarioApertura;

    @NotNull(message = "El horario de cierre no puede estar vacío")
    @Column(name = "Horario_Cierre", columnDefinition = "time(0)")
    private LocalTime horarioCierre;

    @NotBlank(message = "La ciudad no puede estar vacía")
    @Column(name = "Ciudad", nullable = false, length = 100)
    private String ciudad;

    @NotNull(message = "El tipo de negocio no puede estar vacío")
    @Enumerated(EnumType.STRING)
    @Column(name = "Tipo", nullable = false, length = 50)
    private TipoNegocio tipo;
}