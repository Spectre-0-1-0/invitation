'use client';

import { Button } from "@/components/ui/Button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg border-2 border-dashed border-red-200">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle size={32} />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Management Console Error</h1>
      <p className="text-gray-500 max-w-md mb-8">
        There was a problem loading this section of the admin dashboard. This could be due to a database connection issue or an expired session.
      </p>

      <div className="flex gap-4">
        <Button onClick={() => reset()} className="flex items-center gap-2">
          <RefreshCw size={16} /> Try Again
        </Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Full Page Reload
        </Button>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <pre className="mt-12 p-4 bg-gray-50 rounded text-left text-xs text-red-600 max-w-2xl overflow-auto">
          {error.stack}
        </pre>
      )}
    </div>
  );
}
