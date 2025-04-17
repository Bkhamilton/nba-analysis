import Link from 'next/link';
import { Button } from './ui/button'; // Adjust the import path for Button if necessary

const Header = () => {
    return (
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
    );
};

export default Header;