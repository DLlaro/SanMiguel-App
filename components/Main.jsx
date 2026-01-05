import { useEffect, useState } from "react";
import {
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
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMenuDia } from "../lib/menu_dia";
import { PlatoCard } from "./Plato";
import { BotonPresionable } from "./BotonPresionable";

export function Main() {
  const [platos, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    cargarPlatos();
  }, []);

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
        setMenu(platos);
        setLoading(false);
      })
      .catch((err) => {
        clearTimeout(timeout);
        setLoading(false);
        setError(true);
      });
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
            <Image
              source={require("../assets/stc2.png")}
              style={{ width: 200, height: 50, alignSelf: "center" }}
              resizeMode="contain"
            />
          </View>

          {/* Número de mesa */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 0,
            }}
          >
            <Text style={styles.table}>Mesa</Text>
            <TextInput
              placeholder="#"
              style={styles.num_table}
              keyboardType="numeric"
            />
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
              data={platos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <PlatoCard plato={item} />}
              scrollEnabled={false} // si quieres que ScrollView maneje el scroll
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
});
