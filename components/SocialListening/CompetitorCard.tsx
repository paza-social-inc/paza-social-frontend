import { Competitor } from '@/types/social-listener';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CompetitorCardProps {
  competitor: Competitor;
}

export function CompetitorCard({ competitor }: CompetitorCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{competitor.name}</CardTitle>
          <Badge variant="outline">{competitor.platform}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Threat Level: <Badge>{competitor.threat_level}</Badge>
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Audience Overlap</p>
          <Progress value={competitor.audience_overlap * 100} className="h-2" />
          <span className="text-xs text-muted-foreground">{(competitor.audience_overlap * 100).toFixed(0)}%</span>
        </div>

        <div>
          <p className="text-sm font-medium">Key Messaging</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {competitor.key_messaging.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>

        {competitor.evidence.length > 0 && (
          <div>
            <p className="text-sm font-medium">Evidence</p>
            <div className="space-y-1 mt-1">
              {competitor.evidence.map((e, i) => (
                <div key={i} className="text-sm text-muted-foreground border-l-2 pl-2 italic">
                  “{e.text}” <span className="text-xs">{e.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {competitor.similar_creators.length > 0 && (
          <div>
            <p className="text-sm font-medium">Similar Creators</p>
            <p className="text-sm text-muted-foreground">{competitor.similar_creators.join(', ')}</p>
          </div>
        )}

        <div>
          <p className="text-sm font-medium">Paza Insight</p>
          <p className="text-sm italic text-muted-foreground">{competitor.paza_insight.text}</p>
        </div>
      </CardContent>
    </Card>
  );
}