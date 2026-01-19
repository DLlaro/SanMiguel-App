import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import {
  Alert,
  FlatList,
  TextInput,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import {
  getMenuDia,
  checkAndUpdateQuantity,
  getLastId,
  enviarPedido,
} from "../lib/menu_dia";
import { PlatoCard } from "./Plato";
import { BotonPresionable } from "./BotonPresionable";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons/faArrowRotateRight";

export function Main() {
  const [pedidoKey, setPedidoKey] = useState(0); // state to force re-render when data is send
  const [platos, setPlatos] = useState([]); // data retrieved
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(false); // error state
  const [pedido, setPedido] = useState({}); // pedido data to register
  const [numMesa, setNumMesa] = useState(""); // mesa data to register
  const [numTipo, setNumTipo] = useState({});

  //execute the app is open first time
  useEffect(() => {
    cargarPlatos();
  }, []);
  // Actualizar contador de tipos cuando cambie el pedido
  useEffect(() => {
    const nuevoNumTipo = {};

    Object.values(pedido).forEach((item) => {
      if (item && item.tipo && item.cantidad > 0) {
        nuevoNumTipo[item.tipo] =
          (nuevoNumTipo[item.tipo] || 0) + item.cantidad;
      }
    });

    setNumTipo(nuevoNumTipo);
  }, [pedido]);
  const cargarPlatos = () => {
    setLoading(true);
    setError(false);

    //timeout after 10 seconds
    const timeout = setTimeout(() => {
      setLoading(false);
      setError(true);
    }, 2000);

    getMenuDia()
      .then((platos) => {
        clearTimeout(timeout);
        setPlatos(platos);
        setLoading(false);
      })
      .catch((err) => {
        clearTimeout(timeout);
        setLoading(false);
        setError(true);
      });
  };

  //update when quantity is set to 0
  const handlePlatoChange = (platoId, datoPlato) => {
    setPedido((prev) => {
      if (datoPlato === null) {
        const { [platoId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [platoId]: datoPlato };
    });
  };

  // send data to endpoint
  const enviarDatos = async () => {
    if (!numMesa) {
      Toast.show({
        type: "error",
        text1: "Mesa requerida",
        text2: "Ingresa el número de mesa",
      });
      return;
    }

    // Filter dishes 0 quantity
    const platosValidos = Object.values(pedido)
      .filter((plato) => plato.cantidad > 0)
      .sort((a, b) => a.id.localeCompare(b.id)); // compare dishes.id and sort

    if (platosValidos.length === 0) {
      Toast.show({
        type: "error",
        text1: "Sin platos",
        text2: "Agrega al menos un plato",
      });
      return;
    }

    const lastId = (await getLastId()) + 1;
    console.log(lastId);
    const datosEnviar = {
      idPedido: lastId,
      mesa: numMesa,
      items: platosValidos.map((plato) => ({
        ID: plato.id,
        Nombre: plato.nombre,
        Tipo: plato.tipo,
        Cantidad: plato.cantidad,
        Observaciones: plato.observaciones
          .filter((obs) => obs.texto.trim()) //filter obs with empty text
          .map((obs) => `${obs.cantidad}x ${obs.texto}`)
          .join(", "),
      })),
    };

    //wrap all in an alert
    Alert.alert(
      "Confirmar pedido",
      `Mesa ${numMesa}\n${platosValidos.length} platos`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Enviar",
          onPress: async () => {
            console.log("Enviando s:", JSON.stringify(datosEnviar, null, 2));
            // Check quantities
            const resultado = await checkAndUpdateQuantity(
              platos,
              platosValidos
            );
            console.log(resultado);
            if (!resultado.success) {
              Toast.show({
                type: "error",
                text1: "Sin disponibilidad",
                text2: resultado.mensaje,
              });
              return;
            }

            // Si llegamos aquí, todo salió bien
            Toast.show({
              type: "success",
              text1: "Pedido registrado",
              text2: "Cantidades actualizadas correctamente",
            });
            const result = await enviarPedido(datosEnviar);

            if (result?.success) {
              Toast.show({
                type: "success",
                text1: "Pedido enviado",
              });
              setNumMesa("");
              setPedido({});
              setPedidoKey((k) => k + 1); // force to recreate the components
              cargarPlatos();
            } else {
              Toast.show({
                type: "error",
                text1: "Error en el registro del pedido",
              });
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
          <View style={styles.rowContainer}>
            {/* Título */}
            <Text style={styles.title}>Tomar pedido</Text>

            {/* Logo */}
            {/*<Image
              source={require("../assets/stc2.png")}
              style={{ width: 200, height: 50, alignSelf: "center" }}
              resizeMode="contain"
            />*/}
            <BotonPresionable
              onPress={cargarPlatos}
              style={styles.btn_reintentar}
            >
              <FontAwesomeIcon
                icon={faArrowRotateRight}
                size={20}
                color="#fff"
              />
            </BotonPresionable>
          </View>

          {/* Número de mesa */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 0,
            }}
          >
            <Text style={styles.table}>Mesa</Text>
            <TextInput
              placeholder="#"
              value={numMesa}
              onChangeText={setNumMesa}
              style={styles.num_table}
            />
            <BotonPresionable onPress={enviarDatos} style={styles.btn_enviar}>
              <Text
                style={{ color: "#fff", fontStyle: "italic", fontSize: 14 }}
              >
                REGISTRAR MENU
              </Text>
            </BotonPresionable>
          </View>

          {/* Platos */}
          {loading ? (
            <ActivityIndicator style={{ color: "#000000ff" }} size="large" />
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>No se pudo cargar el menú</Text>
              <BotonPresionable
                onPress={cargarPlatos}
                style={styles.btn_reintentar}
              >
                <Text style={styles.retryText}>Reintentar</Text>
              </BotonPresionable>
            </View>
          ) : (
            <FlatList
              key={pedidoKey}
              data={platos}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <>
                  {(index === 0 || platos[index - 1].tipo !== item.tipo) && (
                    <View style={styles.separadorContainer}>
                      <Text style={styles.tipoTexto}>
                        {item.tipo.toUpperCase()}: {numTipo[item.tipo] || 0}
                      </Text>
                      <View style={styles.lineaSeparador} />
                    </View>
                  )}
                  <PlatoCard
                    plato={item}
                    onPlatoChange={(data) => handlePlatoChange(item.id, data)}
                  />
                </>
              )}
              scrollEnabled={false}
              style={styles.flatlist}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  table: {
    marginRight: 10,
    fontSize: 18,
  },
  num_table: {
    marginTop: 10,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 18,
  },
  errorContainer: {
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#c22424ff",
    marginBottom: 15,
  },
  btn_enviar: {
    backgroundColor: "#28a745",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btn_reintentar: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  flatlist: {
    marginTop: 20,
  },
  tipoTexto: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3ec5fa",
    marginBottom: 8,
  },
  lineaSeparador: {
    height: 2,
    backgroundColor: "#3ec5fa",
  },
});
