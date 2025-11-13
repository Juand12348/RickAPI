import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

// ------------------------------------------
// FUNCIÓN PRINCIPAL
// ------------------------------------------
export function mostrarOriginal() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h1>Adivina el Personaje 🔍</h1>
    <div id="game"></div>
    <div id="mensaje"></div>
    <button id="btnNuevaRonda">Nueva Ronda</button>
  `;

  document.getElementById("btnNuevaRonda").addEventListener("click", () => {
    iniciarRonda();
  });

  iniciarRonda();
}

// ------------------------------------------
// INICIAR RONDA
// ------------------------------------------
async function iniciarRonda() {
  const mensaje = document.getElementById("mensaje");
  mensaje.textContent = "";

  const personajeCorrecto = await obtenerPersonajeRandom();
  const opciones = await obtenerOpciones(personajeCorrecto);

  mostrarUI(personajeCorrecto, opciones);
}

// ------------------------------------------
// OBTENER PERSONAJE RANDOM
// ------------------------------------------
async function obtenerPersonajeRandom() {
  const randomId = Math.floor(Math.random() * 826) + 1;
  const res = await fetch(`https://rickandmortyapi.com/api/character/${randomId}`);
  return await res.json();
}

// ------------------------------------------
// OBTENER 4 OPCIONES (1 correcta + 3 falsas)
// ------------------------------------------
async function obtenerOpciones(correcto) {
  let opciones = [correcto];

  while (opciones.length < 4) {
    const idRandom = Math.floor(Math.random() * 826) + 1;
    const res = await fetch(`https://rickandmortyapi.com/api/character/${idRandom}`);
    const personaje = await res.json();

    if (!opciones.some((p) => p.id === personaje.id)) {
      opciones.push(personaje);
    }
  }

  return opciones.sort(() => Math.random() - 0.5);
}

// ------------------------------------------
// UI DEL JUEGO + GUARDADO EN FIREBASE
// ------------------------------------------
function mostrarUI(personajeCorrecto, opciones) {
  const gameDiv = document.getElementById("game");
  const mensaje = document.getElementById("mensaje");

  gameDiv.innerHTML = `
    <img src="${personajeCorrecto.image}" width="200" style="border-radius:10px; margin:10px">
    <h3>Adivina quién es 👇</h3>
    <div id="opciones"></div>
  `;

  const opcionesDiv = document.getElementById("opciones");

  opciones.forEach((p) => {
    const btn = document.createElement("button");
    btn.textContent = p.name;
    btn.style.display = "block";
    btn.style.margin = "8px 0";

    btn.addEventListener("click", async () => {
      if (p.id === personajeCorrecto.id) {
        mensaje.textContent = "¡Correcto! +10 puntos 🎉";
        mensaje.style.color = "green";
        await sumarPuntos(10);
      } else {
        mensaje.textContent = `Incorrecto 😢 Era: ${personajeCorrecto.name}`;
        mensaje.style.color = "red";
      }
    });

    opcionesDiv.appendChild(btn);
  });
}

// ------------------------------------------
// SUMAR PUNTOS EN FIREBASE
// ------------------------------------------
async function sumarPuntos(cantidad) {
  const user = auth.currentUser;

  if (!user) {
    alert("Debes iniciar sesión para guardar tus puntos.");
    return;
  }

  const ref = doc(db, "puntuaciones", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, { puntos: cantidad });
  } else {
    const puntosActuales = snap.data().puntos || 0;
    await setDoc(ref, { puntos: puntosActuales + cantidad });
  }
}
