/**
 * Loading state for audit report page
 */

import { Container } from "@/components/layout";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Container>
        <div className="py-12 space-y-12">
          {/* Header skeleton */}
          <div className="text-center space-y-4">
            <div className="h-10 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse" />
            <div className="h-6 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse" />
          </div>
          
          {/* Hero skeleton */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Tool stack skeleton */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded-lg w-48 mb-4 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
          
          {/* Recommendations skeleton */}
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-64 animate-pulse" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-white border border-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
