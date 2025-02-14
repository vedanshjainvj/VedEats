import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-restaurant-900 via-restaurant-700 to-restaurant-500 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent-gold opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-accent-cream opacity-10 rounded-full blur-3xl animate-pulse delay-100"></div>
      </div>

      <div className="relative flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-restaurant-400 opacity-20 blur-xl animate-ping"></div>
          <Loader2 className="w-16 h-16 text-accent-cream animate-spin" />
        </div>
        <p className="text-accent-cream text-lg font-light tracking-wider animate-pulse">
          Preparing your experience...
        </p>
      </div>
    </div>
  );
};

export default Loading;