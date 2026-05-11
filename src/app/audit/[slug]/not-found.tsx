import Link from "next/link";
import { Container } from "@/components/layout";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto text-center space-y-6 py-12">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Report Not Found
            </h1>
            <p className="text-gray-600">
              This audit report could not be found. It may have been removed or the link may be incorrect.
            </p>
          </div>
          
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Run New Audit
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
