import { Recommendation } from '@/types/social-listener';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RecommendationsProps {
  recommendation: Recommendation;
}

export function Recommendations({ recommendation }: RecommendationsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Collaboration Recommendations</CardTitle>
          <p className="text-sm text-muted-foreground">Campaign Goal: {recommendation.goal}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="font-medium text-lg">Recommended Creator Partnerships</p>
            {recommendation.creators.map((c, idx) => (
              <div key={idx} className="border rounded-lg p-3 mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{c.name}</span>
                  <Badge>{c.score * 100}%</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{c.handle}</p>
                <p className="text-sm mt-1">{c.why}</p>
                <p className="text-sm font-medium mt-2">Expected Contribution:</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {c.expected_contribution.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <p className="font-medium text-lg">Recommended Communities</p>
            {recommendation.communities.map((c, idx) => (
              <div key={idx} className="border rounded-lg p-3 mt-2">
                <span className="font-semibold">{c.name}</span>
                <p className="text-sm text-muted-foreground">{c.why}</p>
                <p className="text-sm font-medium mt-2">Recommended Activity:</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {c.recommended_activity.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <p className="font-medium text-lg">Content Themes</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {recommendation.content_themes.map((t) => (
                <Badge key={t} variant="secondary">{t}</Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium text-lg">Campaign Phases</p>
            <div className="grid gap-2 mt-1">
              {recommendation.phases.map((p, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Badge variant="outline">{idx + 1}</Badge>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium text-lg">Risks to Consider</p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              {recommendation.risks.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-medium text-lg">Paza Recommendation</p>
            <p className="text-sm italic text-muted-foreground">{recommendation.paza_recommendation}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}