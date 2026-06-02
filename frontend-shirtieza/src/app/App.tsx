import AppRoutes from '@app/routes';
import { AuthProvider } from '@app/providers/AuthContext';
import { CartProvider } from '@app/providers/CartContext';
import { ToastProvider } from '@app/providers/ToastContext';

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
