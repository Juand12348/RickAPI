import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig.js";

export function mostrarLogin() {
  const app = document.getElementById("app");
    app.classList.add("centered");  // <-- activa grid para home
    app.classList.remove("grid-home");

  app.innerHTML = `
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <input type="email" id="correo" placeholder="Correo electrónico" />
    <input type="password" id="contrasena" placeholder="Contraseña" />
    <button id="btnLogin">Ingresar</button>
  </div>
  `;


  document.getElementById("btnLogin").addEventListener("click", async () => {
  const correo = document.getElementById("correo").value;
  const contrasena = document.getElementById("contrasena").value;

  try {
    await signInWithEmailAndPassword(auth, correo, contrasena);
    // ❌ NO recargar la página
    // window.location.reload();

    // ✅ Solo dejar que el onAuthStateChanged haga su trabajo
  } catch (error) {
    alert("Error al iniciar sesión: " + error.message);
  }
});

}
