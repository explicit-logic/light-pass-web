import { useLanguage } from '@/hooks/useLanguage';

export const LoadingOverlay = () => {
  const { isLoading } = useLanguage();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-4">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-lg font-medium">Loading translations...</span>
      </div>
    </div>
  );
};
