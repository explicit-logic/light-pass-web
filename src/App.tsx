import { Outlet } from '@tanstack/react-router';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSelector } from '@/components/LanguageSelector';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { LanguageProvider } from '@/contexts/LanguageContext';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <LanguageProvider>
        <ThemeToggle />
        <LanguageSelector />
        <LoadingOverlay />
        <Outlet />
      </LanguageProvider>
    </div>
  );
}

export default App;
