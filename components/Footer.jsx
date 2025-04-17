import React from 'react';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="border-t border-gray-800 py-8 bg-[#0E1C36] px-16">
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
    );
};

export default Footer;