import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export function mostrarOriginal() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <div>
            <h2>Juego: Adivina el personaje de Rick & Morty</h2>
            <p id="puntuacion">Cargando puntuación...</p>
            <p id="pregunta">Cargando personaje...</p>
            <img id="imagen" style="width:200px; border-radius:10px" />

            <div id="opciones"></div>

            <button id="btnNuevo">Nuevo personaje</button>
        </div>
    `;

    let personajeCorrecto = null;
    let puntos = 0;

    // =====================================================
    // 🟣 1. Cargar puntaje del usuario actual desde Firestore
    // =====================================================
    async function cargarPuntuacion() {
        const user = auth.currentUser;

        if (!user) {
            document.getElementById("puntuacion").textContent = "Inicia sesión para guardar tu puntaje";
            return;
        }

        const ref = doc(db, "puntajes", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
            puntos = snap.data().puntos;
        } else {
            // Si no tiene puntaje aún se crea con 0
            await setDoc(ref, { puntos: 0 });
        }

        document.getElementById("puntuacion").textContent = `Puntuación: ${puntos}`;
    }

    cargarPuntuacion();

    // =====================================================
    // 🟢 2. Guardar el puntaje en Firestore
    // =====================================================
    async function guardarPuntuacion() {
        const user = auth.currentUser;
        if (!user) return;

        const ref = doc(db, "puntajes", user.uid);
        await setDoc(ref, { puntos });
    }

    // =====================================================
    // 🔵 3. Cargar un personaje aleatorio desde la API
    // =====================================================
    async function cargarPersonaje() {
        document.getElementById("pregunta").textContent = "Cargando personaje...";

        const num = Math.floor(Math.random() * 826) + 1;
        const res = await fetch(`https://rickandmortyapi.com/api/character/${num}`);
        personajeCorrecto = await res.json();

        document.getElementById("imagen").src = personajeCorrecto.image;

        document.getElementById("pregunta").textContent = `¿Quién es este personaje?`;

        generarOpciones();
    }

    // =====================================================
    // 🔶 4. Generar opciones falsas + la correcta
    // =====================================================
    async function generarOpciones() {
        const opcionesDiv = document.getElementById("opciones");
        opcionesDiv.innerHTML = "";

        let opciones = [personajeCorrecto.name];

        while (opciones.length < 4) {
            const num = Math.floor(Math.random() * 826) + 1;
            const res = await fetch(`https://rickandmortyapi.com/api/character/${num}`);
            const personaje = await res.json();

            if (!opciones.includes(personaje.name)) {
                opciones.push(personaje.name);
            }
        }

        opciones = opciones.sort(() => Math.random() - 0.5);

        opciones.forEach((opcion) => {
            const btn = document.createElement("button");
            btn.textContent = opcion;

            btn.addEventListener("click", () => validarRespuesta(opcion));

            opcionesDiv.appendChild(btn);
        });
    }

    // =====================================================
    // 🟠 5. Validar respuesta y actualizar puntuación
    // =====================================================
    async function validarRespuesta(opcion) {
        if (opcion === personajeCorrecto.name) {
            alert("¡Correcto! +1 punto");
            puntos++;
            await guardarPuntuacion();
        } else {
            alert("Incorrecto 😢");
        }

        document.getElementById("puntuacion").textContent = `Puntuación: ${puntos}`;
        cargarPersonaje();
    }

    // Botón para un nuevo personaje
    document.getElementById("btnNuevo").addEventListener("click", cargarPersonaje);

    cargarPersonaje();
}
