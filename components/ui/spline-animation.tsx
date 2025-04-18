"use client";

import { useState, useEffect } from "react";

// Fallback component when Spline fails
function SplineFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100/50 to-blue-100/50 dark:from-indigo-950/30 dark:to-blue-900/30 rounded-xl overflow-hidden">
      <div className="text-center p-6">
        <div className="mb-4 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">RuralCare AI 3D Model</h3>
        <p className="text-muted-foreground text-sm">
          Interactive 3D visualization of RuralCare AI's healthcare management system.
        </p>
      </div>
    </div>
  );
}

// Loading component for Spline
function SplineLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100/50 to-blue-100/50 dark:from-indigo-950/30 dark:to-blue-900/30 rounded-xl">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        <p className="mt-4 text-muted-foreground animate-pulse">Loading 3D scene...</p>
      </div>
    </div>
  );
}

export default function SplineAnimation({ 
  scene = "https://prod.spline.design/eXhiM12HgM3KCHzZ/scene.splinecode", 
  className = "" 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state and then fallback to the static component
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[300px] rounded-xl overflow-hidden bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/30 dark:to-blue-900/30 ${className}`}>
      {isLoading ? (
        <SplineLoader />
      ) : (
        <SplineFallback />
      )}
    </div>
  );
} 