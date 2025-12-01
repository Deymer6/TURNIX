package com.turnix.turnix_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // <--- IMPORTANTE
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalTime;

@Entity
@Table(name = "Disponibilidad_Semanal")
@Data
@NoArgsConstructor

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
public class DisponibilidadSemanal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Disponibilidad")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Profesional", nullable = false)

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "disponibilidades", "citas", "negocio"})
    private Profesional profesional;

    @Column(name = "Dia_Semana", nullable = false)
    private Integer diaSemana;

    @Column(name = "Hora_Inicio", nullable = false, columnDefinition = "time(0)")
    private LocalTime horaInicio;

    @Column(name = "Hora_Fin", nullable = false, columnDefinition = "time(0)")
    private LocalTime horaFin;
}