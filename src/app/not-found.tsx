'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#141212] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Large 404 Text */}
            <div className="text-9xl font-bold text-[#262626] select-none">
              404
            </div>
            {/* Compass Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-[#fa4616] rounded-2xl flex items-center justify-center shadow-2xl">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl sm:text-5xl font-bold text-[#fafafa] mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>

        {/* Suggestions */}
        <div className="bg-[#262626] border border-[#7f7f7f]/20 rounded-2xl p-6 mb-8 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-[#fafafa] mb-3">What you can try:</h2>
          <ul className="text-left text-gray-400 space-y-2">
            <li className="flex items-start">
              <span className="text-[#fa4616] mr-2">•</span>
              <span>Check the URL for typos</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#fa4616] mr-2">•</span>
              <span>Go back to the previous page</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#fa4616] mr-2">•</span>
              <span>Visit the homepage and start fresh</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#fa4616] mr-2">•</span>
              <span>Contact support if you believe this is an error</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 bg-[#262626] hover:bg-[#333333] border border-[#7f7f7f]/20 hover:border-[#fa4616]/50 text-white font-medium rounded-xl transition-all duration-200 group"
          >
            <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-[#fa4616] hover:bg-[#e03d12] text-white font-medium rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl group"
          >
            <Home className="mr-2 w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Error Code */}
        <div className="mt-12 pt-8 border-t border-[#7f7f7f]/20">
          <p className="text-sm text-gray-500">
            Error Code: <span className="text-[#fa4616] font-mono">404</span> | Page Not Found
          </p>
        </div>
      </div>
    </div>
  )
}
