package com.turnix.turnix_backend.model;

import java.io.Serializable;
import java.util.Objects;

public class ProfesionalServicioId implements Serializable {

    private Integer profesional;
    private Integer servicio;

    public ProfesionalServicioId() {}

    public ProfesionalServicioId(Integer profesional, Integer servicio) {
        this.profesional = profesional;
        this.servicio = servicio;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProfesionalServicioId that = (ProfesionalServicioId) o;
        return Objects.equals(profesional, that.profesional) && Objects.equals(servicio, that.servicio);
    }

    @Override
    public int hashCode() {
        return Objects.hash(profesional, servicio);
    }
}