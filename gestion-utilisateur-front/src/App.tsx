import RoutesIndex from "./route";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <RoutesIndex />
    </AuthProvider>
  );
};

export default App;
