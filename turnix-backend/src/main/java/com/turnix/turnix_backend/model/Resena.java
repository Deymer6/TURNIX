package com.turnix.turnix_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Resena")
@Data
@NoArgsConstructor
public class Resena {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Resena")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Cita", nullable = false, unique = true)
    private Cita cita;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Cliente", nullable = false)
    private Usuario cliente;

    @Column(name = "Calificacion", nullable = false)
    private Integer calificacion;

    @Column(name = "Comentario")
    private String comentario;

    @Column(name = "Fecha_Creacion", nullable = false, columnDefinition = "datetime2(0)")
    private LocalDateTime fechaCreacion = LocalDateTime.now();
}