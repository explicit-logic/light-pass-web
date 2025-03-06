import { useLanguage } from '@/hooks/useLanguage';

export const LoadingOverlay = () => {
  const { isLoading } = useLanguage();

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden 
                    bg-gray-700 opacity-75 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center space-x-2 animate-pulse">
        <div className="w-8 h-8 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-8 h-8 bg-blue-500 rounded-full animate-bounce delay-100"></div>
        <div className="w-8 h-8 bg-blue-500 rounded-full animate-bounce delay-200"></div>
      </div>
      <h2 className="text-center text-white text-xl font-semibold mt-4">Loading translations...</h2>
      <p className="w-1/3 text-center text-white">This may take a few seconds, please wait...</p>
    </div>
  );
};
