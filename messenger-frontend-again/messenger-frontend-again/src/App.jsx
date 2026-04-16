import AppRoutes from "./routes/AppRoutes";
import socket from "../src/socket/socket";

console.log("socket connected?", socket.connected);

socket.on("connect", () => {
  console.log("✅ socket connected:", socket.id);
});

function App() {
  return <AppRoutes />;
}

export default App;
