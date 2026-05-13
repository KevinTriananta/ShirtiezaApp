import AppRoutes from './routes';
import { AuthProvider } from './providers/AuthContext';
import { CartProvider } from './providers/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;