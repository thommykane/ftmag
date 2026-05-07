import type { Metadata } from "next";
import { TopChefsClient } from "@/components/top-chefs/TopChefsClient";
import { chefsForDefaultTopChefsPage, getAllChefsOrdered } from "@/lib/chefs/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Top Chefs | Food & Travel Magazine",
  description: "Discover celebrated chefs by cuisine — profiles, specialties, and inspiration.",
};

export default async function TopChefsPage() {
  const all = await getAllChefsOrdered();
  const chefs = chefsForDefaultTopChefsPage(all);
  return <TopChefsClient chefs={chefs} activeCuisine={null} />;
}
