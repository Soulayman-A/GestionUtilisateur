import { VStack, Text, Button, Box, HStack, Card } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToAdmin = () => {
    navigate("/admin");
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
      <VStack gap={6} w="100%" maxW="600px">
        <HStack
          w="100%"
          p={6}
          bg="rgba(255, 255, 255, 0.05)"
          backdropFilter="blur(10px)"
          borderRadius="xl"
          border="1px solid rgba(255, 255, 255, 0.1)"
        >
          <Box flex={1} />
          <Text fontSize="3xl" fontWeight="bold" bgClip="text" color={"white"}>
            Dashboard
          </Text>
          <Box flex={1} display="flex" justifyContent="flex-end">
            <Button
              onClick={handleLogout}
              variant="ghost"
              color="white"
              _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
            >
              {user ? "Déconnexion" : "Se connecter"}
            </Button>
          </Box>
        </HStack>

        {user && (
          <Card.Root
            w="100%"
            bg="rgba(255, 255, 255, 0.05)"
            backdropFilter="blur(10px)"
            borderRadius="xl"
            border="1px solid rgba(255, 255, 255, 0.1)"
            p={6}
          >
            <VStack align="start" gap={3}>
              <HStack>
                <Text fontSize="xl" fontWeight="semibold" color="white">
                  Bienvenue, {user.username}
                </Text>
              </HStack>
              <Text color="gray.400" fontSize="sm">
                Vous êtes connecté avec succès
              </Text>
            </VStack>
          </Card.Root>
        )}

        <Button
          onClick={goToAdmin}
          w="100%"
          bg="rgba(59, 130, 246, 0.1)"
          border="1px solid"
          borderColor="blue.500"
          color="blue.400"
          _hover={{
            bg: "rgba(59, 130, 246, 0.2)",
            borderColor: "blue.400",
          }}
        >
          Accéder à l'administration
        </Button>
      </VStack>
    </Box>
  );
};

export default Dashboard;
