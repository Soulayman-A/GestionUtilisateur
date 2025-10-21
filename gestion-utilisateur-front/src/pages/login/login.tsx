import { useState } from "react";
import { Button, VStack, Input, Field } from "@chakra-ui/react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Fonction login
  async function login(e) {
    e.preventDefault(); // empêche le rechargement de la page
    console.log("Login déclenché !");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Réponse reçue :", response);

      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Login réussi :", result);
    } catch (error) {
      console.error("❌ Erreur de login :", error.message);
    }
  }

  return (
    <VStack p="100px" display="flex" justify="center">
      <VStack
        h="670px"
        w="600px"
        as="form"
        onSubmit={login} // formulaire gère l'envoi
        spacing={4}
      >
        <Field.Root orientation="vertical">
          <Field.Label>Username</Field.Label>
          <Input
            placeholder="Username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Field.Root>

        <Field.Root orientation="vertical">
          <Field.Label>Password</Field.Label>
          <Input
            type="password"
            placeholder="Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field.Root>

        <Button type="submit" colorScheme="blue" w="full">
          Sign In
        </Button>
      </VStack>
    </VStack>
  );
};

export default LoginPage;
