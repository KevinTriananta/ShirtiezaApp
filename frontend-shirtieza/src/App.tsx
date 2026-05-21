import AppRoutes from './routes';
import { AuthProvider } from './providers/AuthContext';
import { CartProvider } from './providers/CartContext';
import { ToastProvider } from './providers/ToastContext';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
