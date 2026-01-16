import { getApiUrl } from "./ip";

const URL = getApiUrl();

export async function getMenuDia() {
  try {
    const rawData = await fetch(URL + "/menu_dia");
    const data = await rawData.json();

    const menuDia = data.map((row) => ({
      fecha: row[0],
      id: row[1],
      nombre: row[2],
      cantidad: Number(row[3]),
    }));

    return menuDia;
  } catch (error) {
    console.error("Error cargando el menú:", error);
    return [];
  }
}

export async function checkAndUpdateQuantity(datosEnviar) {
  let sinDisponibilidad = "";

  // Obtener los platos UNA SOLA VEZ
  let platos = (await getMenuDia()).map((plato) => ({
    id: plato.id,
    nombre: plato.nombre,
    cantidad: plato.cantidad,
  }));

  // Verificar disponibilidad
  datosEnviar.forEach((plato) => {
    const platoStock = platos.find((p) => p.id === plato.id);

    if (platoStock && plato.cantidad > platoStock.cantidad) {
      sinDisponibilidad += `\n${plato.nombre} solo hay: ${platoStock.cantidad}`;
    }
  });

  // Si hay problemas de disponibilidad, no actualizar
  if (sinDisponibilidad) {
    console.log("Problemas de disponibilidad:", sinDisponibilidad);
    return { success: false, mensaje: sinDisponibilidad };
  }

  // Si todo está bien, actualizar cantidades
  datosEnviar.forEach((dato) => {
    let platoStock = platos.find((p) => p.id === dato.id);
    if (platoStock) {
      platoStock.cantidad = platoStock.cantidad - dato.cantidad;
      console.log("asdasdsadasdasd");
    }
  });
  console.log("platos: ", platos);
  // Enviar actualización
  try {
    const response = await fetch(URL + "/actualizar_cantidades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(platos),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error actualizando cantidades:", error);
    return { success: false, mensaje: error.message };
  }
}

export async function getLastId() {
  try {
    const rawData = await fetch(URL + "/lastid");
    const data = await rawData.json();

    // data es [["1"]], así que accedes directamente
    const id = Number(data[0][0]); // Extraer "1"

    //console.log("el id es :", id, "de ttipo", typeof id); // "1"
    return id;
  } catch (error) {
    console.error("Error cargando el id:", error);
    return null;
  }
}

export async function enviarPedido(pedido) {
  try {
    const response = await fetch(URL + "/registrar_menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido),
    });

    if (!response.ok) throw new Error("Error en la respuesta");

    const result = await response.json();

    return result; // { success: true, total: ... }

    //Reset all
  } catch (error) {
    console.error("Error al enviar pedido:", error);
    return null;
  }
}
