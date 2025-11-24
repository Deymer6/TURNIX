package com.turnix.turnix_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "Promocion")
@Data
@NoArgsConstructor
public class Promocion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Promocion")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Negocio", nullable = false)
    @JsonIgnore // Ignorar la serialización de esta relación lazy-loaded
    private Negocio negocio;

    @Column(name = "Titulo", nullable = false, length = 150)
    private String titulo;

    @Column(name = "Descripcion")
    private String descripcion;

    @Column(name = "Fecha_Inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "Fecha_Fin", nullable = false)
    private LocalDate fechaFin;

    @Column(name = "Activa", nullable = false)
    private Boolean activa = true;
}