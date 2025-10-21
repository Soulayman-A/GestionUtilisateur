import { useState } from "react";
import { Button, VStack, Input, Field } from "@chakra-ui/react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Fonction login
  async function login(e) {
    e.preventDefault();
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
      console.log("Login réussi :", result);
    } catch (error) {
      console.error(" Erreur de login :", error.message);
    }
  }

  return (
    <VStack p="100px" display="flex" justify="center" align={"center"}>
      <VStack h="670px" display="flex" align={"center"}>
        <form onSubmit={login}>
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
          <Button mt={4} type="submit" colorScheme="blue" w="100%">
            Sign In
          </Button>
        </form>
      </VStack>
    </VStack>
  );
};

export default LoginPage;
