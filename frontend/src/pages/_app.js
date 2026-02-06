import "@/styles/globals.css";
import "@fontsource/inter";
import { AuthProvider } from '../contexts/AuthContext';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}