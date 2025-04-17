import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PredictionForm from '@/components/PredictionForm';

export default function PredictionsPage() {
  // Simulate loading state (remove in production)
  const isLoading = false;

  return (
    <div className="min-h-screen bg-[#0E1C36] text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-[#C9082A]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4 12l8 10 8-10z" />
            </svg>
            <span className="text-xl font-bold">NBA Predictor Pro</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <Button variant="ghost" asChild>
              <a href="/">Home</a>
            </Button>
            <Button variant="ghost" className="text-[#C9082A]">
              Predictions
            </Button>
            <Button variant="ghost" asChild>
              <a href="/teams">Teams</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="/methodology">Methodology</a>
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <Skeleton className="h-96 w-full max-w-4xl mx-auto mt-8" />
          </div>
        ) : (
          <>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              AI-Powered <span className="text-[#C9082A]">NBA Predictions</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Get winning probabilities for upcoming games using machine learning models trained on historical data
            </p>
            <Card className="w-full max-w-4xl mx-auto border-gray-700">
              <CardContent className="p-8 bg-gradient-to-r from-[#0E1C36] to-[#1a2c56]">
                <PredictionForm />
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-gray-700">
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-gray-700">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-[#C9082A]/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#C9082A]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L4 12l8 10 8-10z" />
                  </svg>
                </div>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription className="text-gray-300">
                  Our models analyze team performance, player stats, and historical matchups.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="border-gray-700">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-[#C9082A]/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#C9082A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle>Real-Time Updates</CardTitle>
                <CardDescription className="text-gray-300">
                  Predictions update daily with the latest game results.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="border-gray-700">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-[#C9082A]/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#C9082A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <CardTitle>Data-Driven Insights</CardTitle>
                <CardDescription className="text-gray-300">
                  See which factors most influence each prediction.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © 2024 NBA Predictor Pro | Built with Next.js and Python
          </p>
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <a href="#">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                </svg>
              </a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}