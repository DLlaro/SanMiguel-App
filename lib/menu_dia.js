export async function getMenuDia() {
  try {
    const rawData = await fetch("http://192.168.0.7:3000/menu_dia");
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

export async function enviarDatos(pedido) {
  try {
    const response = await fetch("http://192.168.0.7:3000/registrar_menu", {
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
