import Constants from "expo-constants";

// Obtener la IP del servidor de desarrollo de Expo
export function getApiUrl() {
  if (__DEV__) {
    // En desarrollo, usa la IP del manifest de Expo
    const debuggerHost = Constants.expoConfig?.hostUri;
    const host = debuggerHost?.split(":")[0];
    return `http://${host}:3000`;
  }
  // En producción, usa tu dominio
  return "https://api.tudominio.com";
}
