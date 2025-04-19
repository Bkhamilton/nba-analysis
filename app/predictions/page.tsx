import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PredictionForm from '@/components/PredictionForm';

export default function PredictionsPage() {
  // Simulate loading state (remove in production)
  const isLoading = false;

  return (
    <div className="min-h-screen bg-[#0E1C36] text-white">
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
    </div>
  );
}