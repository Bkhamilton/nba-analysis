import Link from "next/link"
import Image from "next/image"
import { FaChartBar, FaSyncAlt, FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  // Placeholder data for predictions
  const upcomingMatchups = [
    {
      id: 1,
      team1: { name: "Celtics", logo: "/placeholder.svg?height=50&width=50", winProbability: 65 },
      team2: { name: "Heat", logo: "/placeholder.svg?height=50&width=50", winProbability: 35 },
    },
    {
      id: 2,
      team1: { name: "Bucks", logo: "/placeholder.svg?height=50&width=50", winProbability: 55 },
      team2: { name: "Pacers", logo: "/placeholder.svg?height=50&width=50", winProbability: 45 },
    },
    {
      id: 3,
      team1: { name: "Nuggets", logo: "/placeholder.svg?height=50&width=50", winProbability: 70 },
      team2: { name: "Lakers", logo: "/placeholder.svg?height=50&width=50", winProbability: 30 },
    },
    {
      id: 4,
      team1: { name: "Thunder", logo: "/placeholder.svg?height=50&width=50", winProbability: 60 },
      team2: { name: "Pelicans", logo: "/placeholder.svg?height=50&width=50", winProbability: 40 },
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#0E1C36] text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#0E1C36]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0E1C36]/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#C9082A]"></div>
            <span className="text-xl font-bold">NBA Predictor</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-[#C9082A] transition-colors">
              Home
            </Link>
            <Link href="/predictions" className="text-sm font-medium hover:text-[#C9082A] transition-colors">
              Predictions
            </Link>
            <Link href="/teams" className="text-sm font-medium hover:text-[#C9082A] transition-colors">
              Teams
            </Link>
            <Link href="/players" className="text-sm font-medium hover:text-[#C9082A] transition-colors">
              Players
            </Link>
            <Link href="/methodology" className="text-sm font-medium hover:text-[#C9082A] transition-colors">
              Methodology
            </Link>
          </nav>
          <Button variant="outline" size="icon" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
          <div className="container relative z-10 flex flex-col items-center text-center">
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              NBA Playoffs 2024: <span className="text-[#C9082A]">AI-Powered</span> Predictions
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-300">
              Machine Learning models analyzing historical data to forecast game outcomes
            </p>
            <Button asChild className="mt-8 bg-[#C9082A] hover:bg-[#C9082A]/90">
              <Link href="/predictions">Explore Predictions</Link>
            </Button>
          </div>
        </section>

        {/* Key Features Grid */}
        <section className="py-16 bg-gray-900/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Powered by Advanced Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-[#C9082A]/20 flex items-center justify-center mb-2">
                    <FaChartBar className="h-6 w-6 text-[#C9082A]" />
                  </div>
                  <CardTitle>Win Probability Models</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">
                    Sophisticated algorithms that analyze team performance, player stats, and historical matchups to
                    predict win probabilities.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-[#C9082A]/20 flex items-center justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-[#C9082A]"
                    >
                      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                    </svg>
                  </div>
                  <CardTitle>Player Impact Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">
                    Deep insights into how individual player performance affects team outcomes, including injury impact
                    assessments.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-[#C9082A]/20 flex items-center justify-center mb-2">
                    <FaSyncAlt className="h-6 w-6 text-[#C9082A]" />
                  </div>
                  <CardTitle>Real-Time Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">
                    Models continuously updated with the latest game results, player stats, and team news to ensure
                    accurate predictions.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Live Predictions Preview */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-4">Live Predictions Preview</h2>
            <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
              Check out our current playoff matchup predictions based on our AI models
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {upcomingMatchups.map((matchup) => (
                <Card key={matchup.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image
                          src={matchup.team1.logo || "/placeholder.svg"}
                          alt={matchup.team1.name}
                          width={50}
                          height={50}
                          className="rounded-full bg-gray-700 p-1"
                        />
                        <div>
                          <p className="font-bold">{matchup.team1.name}</p>
                          <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                            <div
                              className="bg-[#C9082A] h-2.5 rounded-full"
                              style={{ width: `${matchup.team1.winProbability}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-400">{matchup.team1.winProbability}% win probability</p>
                        </div>
                      </div>
                      <div className="text-xl font-bold">vs</div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-bold">{matchup.team2.name}</p>
                          <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                            <div
                              className="bg-blue-500 h-2.5 rounded-full"
                              style={{ width: `${matchup.team2.winProbability}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-400">{matchup.team2.winProbability}% win probability</p>
                        </div>
                        <Image
                          src={matchup.team2.logo || "/placeholder.svg"}
                          alt={matchup.team2.name}
                          width={50}
                          height={50}
                          className="rounded-full bg-gray-700 p-1"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button asChild className="bg-[#C9082A] hover:bg-[#C9082A]/90">
                <Link href="/predictions">View All Predictions</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Loading Skeleton Example */}
        <section className="py-12 bg-gray-900/50">
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-8">Live Data Loading Example</h2>
            <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="pt-2">
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Source Attribution */}
        <section className="py-8 bg-gray-900/30">
          <div className="container text-center">
            <p className="text-sm text-gray-400">Data sourced from NBA API and Basketball-Reference</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">Built with Next.js, FastAPI, and Scikit-Learn</p>
          <div className="flex items-center gap-4">
            <Link href="https://github.com" className="text-gray-400 hover:text-white transition-colors">
              <FaGithub className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
