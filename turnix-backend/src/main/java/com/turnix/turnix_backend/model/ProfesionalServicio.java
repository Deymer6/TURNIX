package com.turnix.turnix_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Profesional_Servicio")
@Data
@NoArgsConstructor
@IdClass(ProfesionalServicioId.class)
public class ProfesionalServicio {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Profesional")
    private Profesional profesional;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Servicio")
    private Servicio servicio;
}