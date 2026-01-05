export async function getMenuDia() {
  try {
    const rawData = await fetch("http://192.168.100.104:3000/menu_dia");
    const data = await rawData.json();

    const menuDia = data.map((row) => ({
      fecha: row[0],
      id: row[1],
      plato: row[2],
      cantidad: Number(row[3]),
    }));

    return menuDia;
  } catch (error) {
    console.error("Error cargando el menú:", error);
    return [];
  }
}
