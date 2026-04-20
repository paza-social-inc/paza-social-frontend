
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NewProposalPage() {
  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto">
      <Card className="border-border rounded-xl">
        <CardContent className="py-8 text-center">
          <p className="text-foreground font-medium">Send a proposal from a job</p>
          <p className="text-sm text-muted-foreground mt-1">
            Open a job from the job board and use &quot;Send Proposal&quot; to apply.
          </p>
          <Button asChild className="mt-4">
            <Link href="/jobs">Browse jobs</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
