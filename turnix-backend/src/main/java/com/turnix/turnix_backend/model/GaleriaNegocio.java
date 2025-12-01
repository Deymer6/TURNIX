package com.turnix.turnix_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Galeria_Negocio")
@Data
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class GaleriaNegocio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Foto")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Negocio", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "galeria", "dueno", "profesionales", "servicios"})
    private Negocio negocio;

    @Column(name = "URL_Imagen", nullable = false, length = 2048)
    private String urlImagen;

    @Column(name = "Descripcion", length = 255)
    private String descripcion;
}