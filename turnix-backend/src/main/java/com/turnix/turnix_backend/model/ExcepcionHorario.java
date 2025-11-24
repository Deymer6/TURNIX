package com.turnix.turnix_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "Excepcion_Horario")
@Data
@NoArgsConstructor
public class ExcepcionHorario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Excepcion")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Profesional", nullable = false)
    private Profesional profesional;

    @Column(name = "Fecha_Especifica", nullable = false)
    private LocalDate fechaEspecifica;

    @Column(name = "Hora_Inicio", columnDefinition = "time(0)")
    private LocalTime horaInicio;

    @Column(name = "Hora_Fin", columnDefinition = "time(0)")
    private LocalTime horaFin;

    @Column(name = "Tipo", nullable = false, length = 20)
    private String tipo;
}