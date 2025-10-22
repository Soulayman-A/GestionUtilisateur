import { Toaster as ChakraToaster, createToaster } from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "top-end",
  duration: 3000,
});

export const Toaster = () => {
  return <ChakraToaster toaster={toaster} />;
};
