package com.turnix.turnix_backend.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Cita")
@Data
@NoArgsConstructor
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Cita")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Cliente", nullable = false)
    @JsonIgnore
    private Usuario cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Negocio", nullable = false)
    @JsonIgnore
    private Negocio negocio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Profesional", nullable = false)
    @JsonIgnore
    private Profesional profesional;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Servicio", nullable = false)
    @JsonIgnore
    private Servicio servicio;

    @Column(name = "Fecha_Hora_Inicio", nullable = false, columnDefinition = "datetime2(0)")
    private LocalDateTime fechaHoraInicio;

    @Column(name = "Fecha_Hora_Fin", nullable = false, columnDefinition = "datetime2(0)")
    private LocalDateTime fechaHoraFin;

    @Column(name = "Estado", nullable = false, length = 20)
    private String estado;

    @Column(name = "Precio_Final", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioFinal;

    @Column(name = "Notas_Promocion", length = 100)
    private String notasPromocion;
}