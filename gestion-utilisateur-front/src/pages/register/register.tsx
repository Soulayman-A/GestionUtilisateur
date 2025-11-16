import { useState } from "react";
import {Button, VStack, Input, Field, Box, Text, HStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";


const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();


    async function register(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {

            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                mode: "cors",
                body: JSON.stringify({ username, email, password }),
            });

            const contentType = response.headers.get("content-type");
            let responseData;

            if (contentType?.includes("application/json")) {
                responseData = await response.json();
            } else {
                responseData = await response.text();
            }

            console.log("Corps de la réponse:", responseData);

            if (!response.ok) {
                const errorMessage =
                    typeof responseData === "object" && responseData.message
                        ? responseData.message
                        : typeof responseData === "string"
                            ? responseData
                            : `Erreur ${response.status}: ${response.statusText}`;

                throw new Error(errorMessage);
            }

            setSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter.");
            setUsername("");
            setEmail("");
            setPassword("");

            console.log("Inscription réussie");
            setTimeout(() => navigate("/login"), 3000);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue";
            console.error("Erreur:", errorMessage);
            setError(errorMessage);
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
                        Inscription
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

                <VStack as="form" onSubmit={register} gap={4} w="100%">
                    <Field.Root orientation="vertical" w="100%">
                        <Field.Label color="white">Username</Field.Label>
                        <Input
                            placeholder="Username..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
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
                        <Field.Label color="white">Email</Field.Label>
                        <Input
                            placeholder="Email..."
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
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
                            required
                            minLength={6}
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

                    {success && (
                        <Box
                            w="100%"
                            p={3}
                            bg="rgba(34, 197, 94, 0.1)"
                            border="1px solid rgba(34, 197, 94, 0.3)"
                            borderRadius="md"
                        >
                            <Text color="green.400" fontSize="sm">
                                {success}
                            </Text>
                        </Box>
                    )}

                    <Button
                        type="submit"
                        colorScheme="blue"
                        w="100%"
                        bg="rgba(59, 130, 246, 0.8)"
                        size="lg"
                        color={"white"}
                        isLoading={loading}
                        loadingText="Inscription..."
                        _hover={{ bg: "rgba(59, 130, 246, 1)" }}
                    >
                        S'inscrire
                    </Button>
                </VStack>
            </Box>
        </Box>
    );
};

export default RegisterPage;