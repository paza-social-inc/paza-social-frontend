import { Audience } from '@/types/social-listener';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AudienceProfileProps {
  audience: Audience;
}

export function AudienceProfile({ audience }: AudienceProfileProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{audience.name}</CardTitle>
        <p className="text-sm text-muted-foreground">Audience Intelligence · Confidence: {Math.round(audience.confidence * 100)}%</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="font-medium">Overview</p>
          <p className="text-sm text-muted-foreground">{audience.overview}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="font-medium">Life Stage</p>
            <p className="text-sm text-muted-foreground">{audience.who_they_are.life_stage}</p>
          </div>
          <div>
            <p className="font-medium">Primary Decision Maker</p>
            <p className="text-sm text-muted-foreground">{audience.who_they_are.primary_decision_maker}</p>
          </div>
        </div>

        <div>
          <p className="font-medium">Priorities</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {audience.priorities.map((p) => (
              <Badge key={p} variant="secondary">{p}</Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="font-medium">Common Questions</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {audience.common_questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-medium">Challenges</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {audience.challenges.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-medium">Buying Drivers</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {audience.buying_drivers.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-medium">Platforms</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {audience.platforms.map((p) => (
              <Badge key={p} variant="outline">{p}</Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="font-medium">Language</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {audience.language.map((l) => (
              <Badge key={l} variant="secondary">{l}</Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="font-medium">Paza Insight</p>
          <p className="text-sm italic text-muted-foreground">{audience.paza_insight.text}</p>
        </div>
      </CardContent>
    </Card>
  );
}