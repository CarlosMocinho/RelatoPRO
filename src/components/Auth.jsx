import { auth, Googleauth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";


export const Auth = () => {
  const [email, setEmail] = useState("");
  const [Senha, setSenha] = useState("");


  const entrarGoogle = async () => {
    try {
      await signInWithPopup(auth, Googleauth);
      alert("Usuário criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar usuário:", error.message);
      alert("Erro ao criar usuário: " + error.message);
    }
  };

  const entrar = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, Senha);
      alert("Usuário criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar usuário:", error.message);
      alert("Erro ao criar usuário: " + error.message);
    }
  };

  return (
    <div>
      <input placeholder="Email" type="text"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input placeholder="Senha" type="password"
        onChange={(e) => setSenha(e.target.value)}
      />
      <button onClick={entrar}>Entrar</button>
      <p>Ou</p>
      <button onClick={entrarGoogle}>Entrar com google</button>
    </div>
  );
}