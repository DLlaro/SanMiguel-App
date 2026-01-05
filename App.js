import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { Main } from "./components/Main";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <SafeAreaProvider>
      <Main />

      <StatusBar style="auto" />
      <Toast />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
