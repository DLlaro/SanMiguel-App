import { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import Toast from "react-native-toast-message";
import { BotonPresionable } from "./BotonPresionable";
let nextId = 0; // id único para cada observación

export function PlatoObservacion({ cantTotalPlato, onObservacionesChange }) {
  const [observaciones, setObservaciones] = useState([
    { id: nextId++, texto: "", cantidad: 1 },
  ]);

  useEffect(() => {
    onObservacionesChange(observaciones);
  }, [observaciones]);

  const agregarObservacion = () => {
    // 1. Calcular el total ACTUAL de todas las observaciones
    const totalActual = observaciones.reduce(
      (sum, obs) => sum + obs.cantidad,
      0
    );
    // 2. Validar ANTES de actualizar
    if (totalActual + 1 > cantTotalPlato) {
      Toast.show({
        type: "error",
        text1: "Límite alcanzado",
        text2: "No puedes agregar más observaciones",
        visibilityTime: 2000,
      });
      return;
    }
    setObservaciones((prev) => [
      ...prev,
      { id: nextId++, texto: "", cantidad: 1 },
    ]);
  };

  const actualizarObservacion = (id, texto) => {
    setObservaciones((prev) =>
      prev.map((obs) => (obs.id === id ? { ...obs, texto } : obs))
    );
  };

  const aumentarCantidad = (id) => {
    // 1. Calcular el total ACTUAL de todas las observaciones
    const totalActual = observaciones.reduce(
      (sum, obs) => sum + obs.cantidad,
      0
    );
    // 2. Validar ANTES de actualizar
    if (totalActual + 1 > cantTotalPlato) {
      Toast.show({
        type: "error",
        text1: "Límite alcanzado",
        text2: "No puedes agregar más cantidades",
        visibilityTime: 2000,
      });
      return;
    }
    setObservaciones((prev) =>
      prev.map((obs) =>
        obs.id === id ? { ...obs, cantidad: obs.cantidad + 1 } : obs
      )
    );
  };

  const disminuirCantidad = (id) => {
    setObservaciones((prev) =>
      prev.map((obs) =>
        obs.id === id
          ? { ...obs, cantidad: Math.max(obs.cantidad - 1, 0) }
          : obs
      )
    );
  };

  const eliminarObservacion = (id) => {
    setObservaciones((prev) => prev.filter((obs) => obs.id !== id));
  };

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <View style={styles.separator} />
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        {/* Botón para agregar otra observación */}
        <BotonPresionable
          onPress={agregarObservacion}
          style={styles.btn_agregar_observacion}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>+ Observación</Text>
        </BotonPresionable>
      </View>

      {observaciones.map((obs) => (
        <View key={obs.id} style={styles.observacionContainer}>
          <View style={styles.btn_menos_mas_container}>
            {/*Boton -*/}
            <BotonPresionable
              onPress={() => disminuirCantidad(obs.id)}
              style={styles.btn_menos_mas}
            >
              <Text style={{ color: "#fff" }}>-</Text>
            </BotonPresionable>
            {/*Texto cantidad*/}
            <Text style={{ marginHorizontal: 8, fontSize: 18 }}>
              {obs.cantidad}
            </Text>
            {/*Boton +*/}
            <BotonPresionable
              onPress={() => aumentarCantidad(obs.id)}
              style={styles.btn_menos_mas}
            >
              <Text style={{ color: "#fff" }}>+</Text>
            </BotonPresionable>
          </View>

          <TextInput
            placeholder="Observaciones (ej: sin arroz)"
            value={obs.texto}
            onChangeText={(texto) => actualizarObservacion(obs.id, texto)}
            style={styles.input}
          />
          <BotonPresionable
            onPress={() => eliminarObservacion(obs.id)}
            style={styles.btn_menos_mas}
          >
            <FontAwesomeIcon icon={faTrash} size={20} color="#fff" />
          </BotonPresionable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: "#ccc",
    marginVertical: 8,
  },
  observacionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  btn_agregar_observacion: {
    backgroundColor: "#28a745",
    padding: 5,
    borderRadius: 6,
  },
  btn_menos_mas_container: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btn_menos_mas: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#b42347ff",
    marginHorizontal: 2,
  },
  input: {
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    flex: 6,
    fontSize: 12,
  },
  trash_iconContainer: {
    padding: 6,
    backgroundColor: "#dc3545",
    borderRadius: 3,
    alignItems: "center",
    flex: 1,
  },
});
