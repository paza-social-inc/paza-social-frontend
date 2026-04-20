"use client";

import { useEffect, useState } from "react";
import {
  ShowcaseSearch,
  SHOWCASE_TABS,
  type ProjectNavTab,
} from "@/components/Dashboard/showcase/ShowcaseSearch";
import { MyProjectsGrid } from "@/components/Dashboard/showcase/MyProjectsGrid";
import { CreatorProfileModal } from "@/components/Dashboard/showcase/CreatorProfileModal";
import { mockCreatorProfile } from "@/components/Dashboard/showcase/showcaseData";
import { useAuth } from "@/hooks/store/auth/useAuth";

export default function ShowcasePage() {
  const { user } = useAuth();
  const accountType = String(user?.accountType ?? "").toLowerCase();
  const isCreator = accountType === "creator";
  const tabs: readonly ProjectNavTab[] = isCreator
    ? SHOWCASE_TABS
    : (["All projects", "Collaborating"] as const);

  const [activeNav, setActiveNav] = useState<ProjectNavTab>(tabs[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [creatorProfileOpen, setCreatorProfileOpen] = useState(false);

  useEffect(() => {
    if (!tabs.includes(activeNav)) {
      setActiveNav(tabs[0]);
    }
  }, [activeNav, tabs]);

  return (
    <div className="min-h-dvh sm:min-h-screen bg-background text-foreground">
      <div className="flex flex-col gap-6 sm:gap-8 p-4 sm:p-6 md:px-8 lg:px-10 max-w-7xl mx-auto">
        <ShowcaseSearch
          tabs={tabs}
          activeNav={activeNav}
          onActiveNavChange={setActiveNav}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />

        <section aria-label="Projects list">
          <MyProjectsGrid searchQuery={searchQuery} activeNav={activeNav} />
        </section>

        <CreatorProfileModal
          open={creatorProfileOpen}
          onOpenChange={setCreatorProfileOpen}
          creator={mockCreatorProfile}
        />
      </div>
    </div>
  );
}
