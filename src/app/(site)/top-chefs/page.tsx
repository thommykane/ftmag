import type { Metadata } from "next";
import { TopChefsClient } from "@/components/top-chefs/TopChefsClient";

export const metadata: Metadata = {
  title: "Top Chefs | Food & Travel Magazine",
  description: "Discover celebrated chefs by cuisine — profiles, specialties, and inspiration.",
};

export default function TopChefsPage() {
  return <TopChefsClient />;
}
