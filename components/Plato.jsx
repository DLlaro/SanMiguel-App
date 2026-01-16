import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Switch } from "react-native";
import { PlatoObservacion } from "./PlatoObservacion";
import { BotonPresionable } from "./BotonPresionable";

export function PlatoCard({ plato, onPlatoChange }) {
  const [cantidad, setCantidad] = useState(0);
  const [marcarObservacion, setMarcarObservacion] = useState(false); // checkbox
  const [observaciones, setObservaciones] = useState([]);

  useEffect(() => {
    if (cantidad > 0) {
      onPlatoChange({
        id: plato.id,
        nombre: plato.nombre,
        cantidad,
        observaciones: marcarObservacion ? observaciones : [],
      });
    } else {
      onPlatoChange(null);
    }
  }, [cantidad, observaciones, marcarObservacion]);

  const disminuirCantidad = (id) => {
    const nuevo = Math.max(cantidad - 1, 0);
    setCantidad(nuevo);
    if (nuevo === 0) {
      setMarcarObservacion(false);
    }
  };
  return (
    <View
      key={plato.id}
      style={{
        padding: 10,
        marginBottom: 10,
        borderWidth: 2,
        borderRadius: 8,
        borderColor: "#ccc",
      }}
    >
      {/* Nombre del plato + checkbox */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "45%",
          }}
        >
          <Text style={[styles.texto, cantidad === 0 && styles.txt_disabled]}>
            {plato.nombre}
          </Text>
          <Text
            style={[
              styles.cantDisponible,
              plato.cantidad === 0 && styles.cantNoDisponible,
              cantidad === 0 && styles.txt_disabled,
            ]}
          >
            {plato.cantidad}
          </Text>
        </View>

        {/* Contador */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            marginTop: 10,
          }}
        >
          {/* Checkbox */}
          <Switch
            value={marcarObservacion}
            onValueChange={setMarcarObservacion}
            style={styles.switch}
            disabled={cantidad === 0}
          />
          <BotonPresionable
            onPress={() => disminuirCantidad(plato.id)}
            style={[
              styles.btn_menos_mas,
              cantidad === 0 && styles.btn_disabled,
            ]}
            disabled={cantidad === 0}
          >
            <Text style={{ color: "#fff" }}>-</Text>
          </BotonPresionable>

          <Text style={{ marginHorizontal: 12, fontSize: 22 }}>{cantidad}</Text>
          <BotonPresionable
            onPress={() => setCantidad((c) => c + 1)}
            style={styles.btn_menos_mas}
          >
            <Text style={{ color: "#fff" }}>+</Text>
          </BotonPresionable>
        </View>
      </View>

      {/* TextInput solo si el checkbox está activo */}
      {marcarObservacion && (
        <PlatoObservacion
          cantTotalPlato={cantidad}
          onObservacionesChange={setObservaciones}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  btn_menos_mas: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
  },
  txt_disabled: {
    color: "#c7c7c7ff",
  },
  btn_disabled: {
    backgroundColor: "#999",
    opacity: 0.6,
  },
  texto: {
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    fontSize: 18,
    width: "85%",
    fontWeight: "bold",
  },
  cantDisponible: {
    fontSize: 15,
    width: "15%",
    color: "rgb(132, 224, 132)",
  },
  cantNoDisponible: {
    fontSize: 17,
    width: "15%",
    color: "rgb(255,0,0)",
  },
  switch: {
    marginRight: 15,
  },
});
