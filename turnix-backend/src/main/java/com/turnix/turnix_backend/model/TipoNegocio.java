package com.turnix.turnix_backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.stream.Stream;

public enum TipoNegocio {
    BARBERIA("Barbería"),
    SALON_BELLEZA("Salón de Belleza");

    private final String displayName;

    TipoNegocio(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static TipoNegocio fromDisplayName(String displayName) {
        return Stream.of(TipoNegocio.values())
                .filter(c -> c.displayName.equals(displayName))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Tipo de negocio inválido: " + displayName));
    }
}
