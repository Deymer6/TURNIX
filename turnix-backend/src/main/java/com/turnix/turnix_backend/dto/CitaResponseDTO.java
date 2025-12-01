package com.turnix.turnix_backend.dto;

import com.turnix.turnix_backend.model.Cita;
import com.turnix.turnix_backend.model.Profesional;
import com.turnix.turnix_backend.model.Servicio;
import com.turnix.turnix_backend.model.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CitaResponseDTO {
    private Integer id; // ✅ Integer
    private SimpleUsuarioDTO cliente;
    private SimpleServicioDTO servicio;
    private SimpleProfesionalDTO profesional;
    private LocalDateTime fechaHoraInicio;
    private LocalDateTime fechaHoraFin;
    private String estado;
    private BigDecimal precioFinal;
    private String notasPromocion;
    private Integer negocioId; 

    public CitaResponseDTO(Cita cita) {
       if (cita.getId() != null) {
            this.id = cita.getId(); 
        }
        this.fechaHoraInicio = cita.getFechaHoraInicio();
        this.fechaHoraFin = cita.getFechaHoraFin();
        this.estado = cita.getEstado();
        this.precioFinal = cita.getPrecioFinal();
        this.notasPromocion = cita.getNotasPromocion();

        if (cita.getCliente() != null) {
            this.cliente = new SimpleUsuarioDTO(cita.getCliente());
        }
        if (cita.getServicio() != null) {
            this.servicio = new SimpleServicioDTO(cita.getServicio());
        }
        if (cita.getProfesional() != null) {
            this.profesional = new SimpleProfesionalDTO(cita.getProfesional());
        }
        if (cita.getNegocio() != null) {
            this.negocioId = cita.getNegocio().getId();
        }
    }

    @Data
    @NoArgsConstructor
    public static class SimpleUsuarioDTO {
        private Integer id; 
        private String nombre;
        private String apellido;
        private String telefono;

        public SimpleUsuarioDTO(Usuario usuario) {
            this.id = usuario.getId();
            this.nombre = usuario.getNombre();
            this.apellido = usuario.getApellido();
            this.telefono = usuario.getTelefono();
        }
    }

    @Data
    @NoArgsConstructor
    public static class SimpleServicioDTO {
        private Integer id; 
        private String nombreServicio;
        private int duracionEstimada;

        public SimpleServicioDTO(Servicio servicio) {
            this.id = servicio.getId();
            this.nombreServicio = servicio.getNombreServicio();
            // ✅ CORRECCIÓN CRÍTICA: Evita el NullPointerException si la duración es null
            this.duracionEstimada = (servicio.getDuracionEstimada() != null) ? servicio.getDuracionEstimada() : 0;
        }
    }

    @Data
    @NoArgsConstructor
    public static class SimpleProfesionalDTO {
        private Integer id; 
        private String nombre;

        public SimpleProfesionalDTO(Profesional profesional) {
            this.id = profesional.getId();
            this.nombre = profesional.getNombre();
        }
    }
}