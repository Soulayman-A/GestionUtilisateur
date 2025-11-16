import { VStack, Text, Button, Box, HStack, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../api/apiFetch";

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminData, setAdminData] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const { token, logout } = useAuth();
  const { apiFetch } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  async function checkAdminAccess() {
    setLoading(true);
    setError("");

    try {
      if (!token) {
        throw new Error("Aucun token trouvé, veuillez vous connecter.");
      }

      const response = await apiFetch(
        `${import.meta.env.VITE_API_URL}/admin/users`,
        {
          method: "GET",
            credentials: "include",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée. Veuillez vous reconnecter.");
        } else if (response.status === 403) {
          throw new Error(
            "Accès refusé. Vous n'avez pas les droits administrateur.",
          );
        }
        throw new Error(`Erreur ${response.status}`);
      }

      const result = await response.text();
      setAdminData(result);
      setHasAccess(true);
    } catch (error: any) {
      console.error("Erreur admin :", error);
      setError(error.message || "Accès interdit !");
      setHasAccess(false);

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goBack = () => {
    navigate("/");
  };

  const gestionUtilisateur = () => {
    navigate("/admin/users");
  };

  if (loading) {
    return (
      <Box
        minH="100vh"
        bg="transparent"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.400">Vérification des accès...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        minH="100vh"
        bg="transparent"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        <VStack
          gap={6}
          maxW="500px"
          w="100%"
          p={8}
          bg="rgba(255, 0, 0, 0.05)"
          backdropFilter="blur(10px)"
          borderRadius="xl"
          border="2px solid rgba(255, 0, 0, 0.3)"
        >
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="red.400"
            textAlign="center"
          >
            Accès refusé
          </Text>
          <Text color="gray.400" textAlign="center">
            {error}
          </Text>
          <Text color="gray.500" fontSize="sm" textAlign="center">
            Redirection vers le dashboard dans 3 secondes...
          </Text>
          <Button
            onClick={goBack}
            colorScheme="blue"
            variant="outline"
            w="100%"
          >
            Retour au Dashboard
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      bg="transparent"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <VStack gap={6} w="100%" maxW="800px">
        <HStack
          w="100%"
          p={6}
          bg="rgba(255, 255, 255, 0.05)"
          backdropFilter="blur(10px)"
          borderRadius="xl"
          justifyContent={"space-between"}
          border="1px solid rgba(255, 255, 255, 0.1)"
        >
          <Button
            onClick={goBack}
            variant="ghost"
            color="white"
            _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
          >
            Retour
          </Button>
          <Text
            display={"flex"}
            fontSize="3xl"
            justifyContent={"center"}
            fontWeight="bold"
            bgClip="text"
            color={"white"}
          >
            Administration
          </Text>
          <Button
            onClick={handleLogout}
            variant="ghost"
            color="white"
            _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
          >
            Déconnexion
          </Button>
        </HStack>

        <Box
          w="100%"
          p={6}
          bg="rgba(34, 197, 94, 0.1)"
          backdropFilter="blur(10px)"
          borderRadius="xl"
          border="2px solid rgba(34, 197, 94, 0.3)"
        >
          <VStack align="start" gap={3}>
              <Text fontSize="xl" fontWeight="semibold" color="green.400">
                Accès administrateur accordé
              </Text>
          </VStack>
        </Box>

        <VStack w="100%" gap={4}>
          <Text
            color="gray.400"
            fontSize="sm"
            alignSelf="start"
            fontWeight="semibold"
          >
            Panneau d'administration
          </Text>

          <Box
            w="100%"
            p={6}
            bg="rgba(255, 255, 255, 0.05)"
            backdropFilter="blur(10px)"
            borderRadius="xl"
            border="1px solid rgba(255, 255, 255, 0.1)"
          >
            <VStack gap={3}>
              <Button
                w="100%"
                bg="rgba(59, 130, 246, 0.1)"
                border="1px solid"
                borderColor="blue.500"
                color="blue.400"
                onClick={gestionUtilisateur}
                _hover={{
                  bg: "rgba(59, 130, 246, 0.2)",
                  borderColor: "blue.400",
                }}
              >
                Gestion des utilisateurs
              </Button>
            </VStack>
          </Box>
        </VStack>
      </VStack>
    </Box>
  );
};

export default AdminPage;
