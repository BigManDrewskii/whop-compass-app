"use client";

import { useQuery } from "@tanstack/react-query";
import { useWhop } from "~/components/whop-context";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Card {
  id: number;
  companyId: string;
  order: number;
  type: "text" | "image" | "video";
  title: string | null;
  content: string | null;
  mediaUrl: string | null;
  mediaMimeType: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function ExperiencePage() {
  const { access, user, experience } = useWhop();
  const params = useParams();
  const experienceId = params.experienceId as string;

  // Fetch cards to show count
  const { data: cardsData, isLoading } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const res = await fetch("/api/cards");
      if (!res.ok) throw new Error("Failed to fetch cards");
      return res.json() as Promise<{ cards: Card[] }>;
    },
  });

  const isAdmin = access.accessLevel === "admin";
  const cardCount = cardsData?.cards?.length || 0;

  return (
    <div className="min-h-screen bg-[#141212] flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-[#fa4616] rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-2xl">
              <svg
                className="w-10 h-10 text-white"
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
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to Compass
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Card-based onboarding for {experience.company.title}
          </p>
          <p className="text-sm text-gray-500">
            Logged in as <span className="text-[#fa4616]">{user.name}</span>
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-[#262626] border border-[#7f7f7f]/10 rounded-2xl p-8 mb-8 hover:border-[#fa4616]/30 transition-colors">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#fa4616] mb-2">
                {isLoading ? "..." : cardCount}
              </div>
              <div className="text-sm text-gray-400">
                Onboarding Card{cardCount !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#fa4616] mb-2">
                {isAdmin ? "Admin" : "Member"}
              </div>
              <div className="text-sm text-gray-400">Your Access Level</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {isAdmin && (
            <Link
              href={`/experiences/${experienceId}/admin`}
              className="block w-full bg-[#fa4616] hover:bg-[#e03d12] text-white rounded-xl p-6 transition-all duration-200 shadow-xl hover:shadow-2xl group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Admin Dashboard</h3>
                  <p className="text-white/90 text-sm">
                    Create and manage onboarding cards
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          )}

          <Link
            href={`/experiences/${experienceId}/onboarding`}
            className="block w-full bg-[#262626] hover:bg-[#333333] border border-[#7f7f7f]/20 hover:border-[#fa4616]/50 text-white rounded-xl p-6 transition-all duration-200 shadow-xl hover:shadow-2xl group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  {cardCount > 0 ? "View Onboarding" : "Preview Onboarding"}
                </h3>
                <p className="text-white/70 text-sm">
                  {cardCount > 0
                    ? `Experience ${cardCount} card${cardCount !== 1 ? "s" : ""}`
                    : "See what members will experience"}
                </p>
              </div>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>

          {isAdmin && cardCount === 0 && (
            <div className="bg-[#fa4616]/10 border border-[#fa4616]/30 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-6 h-6 text-[#fa4616] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <h4 className="text-[#fafafa] font-semibold mb-1">
                    No cards yet
                  </h4>
                  <p className="text-[#fafafa]/80 text-sm">
                    Head to the Admin Dashboard to create your first onboarding
                    card
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Experience: <span className="text-gray-400">{experience.name}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
