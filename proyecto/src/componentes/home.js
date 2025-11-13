export default async function mostrarHome() {
    const app = document.getElementById("app");
    app.classList.add("grid-home");  // <-- activa grid para home
    app.classList.remove("centered"); // <-- quita centrado de login/registro/original
    const appContainer = document.getElementById("app");
    appContainer.innerHTML = "<h2>Cargando personajes...</h2>";

    try {
        let personajes = [];
        let nextPage = "https://rickandmortyapi.com/api/character";

        // 🔄 Cargar TODAS las páginas
        while (nextPage) {
            const response = await fetch(nextPage);
            const data = await response.json();
            
            personajes = personajes.concat(data.results);
            nextPage = data.info.next; // siguiente página
        }

        // Limpiar contenedor
        appContainer.innerHTML = "";

        // Construcción de tarjetas
        personajes.forEach((personaje) => {
            const card = document.createElement("div");
            card.classList.add("app-card");

            card.innerHTML = `
                <img src="${personaje.image}" alt="${personaje.name}">
                <div class="app-info">
                    <h2>${personaje.name}</h2>
                    <p><strong>Estado:</strong> ${personaje.status}</p>
                    <p><strong>Especie:</strong> ${personaje.species}</p>
                    <p><strong>Género:</strong> ${personaje.gender}</p>
                    <p><strong>Origen:</strong> ${personaje.origin.name}</p>
                </div>
            `;

            appContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error al cargar personajes:", error);
        appContainer.innerHTML = "<p>Error al cargar personajes 😢</p>";
    }
}
