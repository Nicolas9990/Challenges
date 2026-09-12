import { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email === "admin@mail.com" && password === "123") {
      localStorage.setItem("logged", "true");
      setError("");
      onLogin();
    } else {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="login">
      <h1>Administración de Pacientes</h1>

      <h2>Iniciar sesión</h2>

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Ingresar
      </button>

      {error && (
        <p className="error">
          {error}
        </p>
      )}
    </div>
  );
}

export default Login;
