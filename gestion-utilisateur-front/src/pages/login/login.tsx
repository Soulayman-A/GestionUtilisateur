import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Button,
  VStack,
  Input,
  Field,
  Text,
  Box,
  Link,
  HStack,
} from "@chakra-ui/react";
import { useApi } from "../../api/apiFetch";


const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { apiFetch } = useApi();


    async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiFetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
            credentials: "include",
            body: JSON.stringify({ username, password }),
        },
      );

      console.log("Réponse status:", response.status);

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: Identifiants incorrects`);
      }

      const result = await response.json();
      console.log("Login réussi :", result);

      if (!result.accessToken) {
        console.error("Pas de token dans la réponse:", result);
        throw new Error("Le serveur n'a pas retourné de token");
      }

      login(result.accessToken, result.username || username);

      console.log("Token sauvegardé");

      navigate("/");
    } catch (error: any) {
      console.error("Erreur de login :", error);
      setError(error.message || "Nom d'utilisateur ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  }
    const handleBack = () => {
        navigate(-1);
    };

  return (
    <Box
      minH="100vh"
      bg="transparent"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        gap={6}
        w="100%"
        maxW="400px"
        p={8}
        bg="rgba(255, 255, 255, 0.05)"
        backdropFilter="blur(10px)"
        borderRadius="xl"
        border="1px solid rgba(255, 255, 255, 0.1)"
      >
          <HStack>
              <Text
                  justifyContent={"center"}
                  fontSize="3xl"
                  fontWeight="bold"
                  bgGradient="linear(to-r, cyan.400, blue.500)"
                  bgClip="text"
                  color={"white"}
              >
                  Connexion
              </Text>
              <Box flex={1} display="flex" justifyContent="flex-end">
                  <Button
                      onClick={handleBack}
                      variant="ghost"
                      color="white"
                      _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                  >
                      {"Retour"}
                  </Button>
              </Box>
          </HStack>

        <VStack as="form" onSubmit={handleLogin} gap={4} w="100%">
          <Field.Root orientation="vertical" w="100%">
            <Field.Label color="white">Username</Field.Label>
            <Input
              placeholder="Username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              bg="rgba(255, 255, 255, 0.1)"
              border="1px solid rgba(255, 255, 255, 0.2)"
              color="white"
              _placeholder={{ color: "gray.400" }}
              _hover={{ borderColor: "rgba(255, 255, 255, 0.3)" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3b82f6",
              }}
            />
          </Field.Root>

          <Field.Root orientation="vertical" w="100%">
            <Field.Label color="white">Password</Field.Label>
            <Input
              type="password"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              bg="rgba(255, 255, 255, 0.1)"
              border="1px solid rgba(255, 255, 255, 0.2)"
              color="white"
              _placeholder={{ color: "gray.400" }}
              _hover={{ borderColor: "rgba(255, 255, 255, 0.3)" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3b82f6",
              }}
            />
          </Field.Root>

          {error && (
            <Box
              w="100%"
              p={3}
              bg="rgba(239, 68, 68, 0.1)"
              border="1px solid rgba(239, 68, 68, 0.3)"
              borderRadius="md"
            >
              <Text color="red.400" fontSize="sm">
                {error}
              </Text>
            </Box>
          )}

          <Button
            type="submit"
            colorScheme="blue"
            w="100%"
            bg="rgba(255, 255, 255, 0.1)"
            size="lg"
            color={"white"}
            isLoading={loading}
            loadingText="Connexion..."
          >
            Se connecter
          </Button>
            <Link href="/register">
                <Text fontSize="16">Pas de compte ?</Text>
            </Link>
        </VStack>
      </Box>
    </Box>
  );
};

export default LoginPage;
