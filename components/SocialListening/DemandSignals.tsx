import { DemandSignal } from '@/types/social-listener';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DemandSignalsProps {
  signals: DemandSignal[];
}

export function DemandSignals({ signals }: DemandSignalsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Demand Intelligence</CardTitle>
          <p className="text-sm text-muted-foreground">Top demand signals discovered</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {signals.map((signal, idx) => (
            <div key={idx} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{signal.topic}</h3>
                <Badge variant={signal.strength === 'High' ? 'default' : 'secondary'}>{signal.strength}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{signal.description}</p>

              {signal.evidence.length > 0 && (
                <div>
                  <p className="text-sm font-medium">Evidence</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {signal.evidence.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <p className="text-sm font-medium">Related Keywords</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {signal.related_keywords.map((kw) => (
                    <Badge key={kw} variant="secondary">{kw}</Badge>
                  ))}
                </div>
              </div>

              {signal.related_products.length > 0 && (
                <div>
                  <p className="text-sm font-medium">Related Products</p>
                  <p className="text-sm text-muted-foreground">{signal.related_products.join(', ')}</p>
                </div>
              )}

              {signal.emerging_topics.length > 0 && (
                <div>
                  <p className="text-sm font-medium">Emerging Topics</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {signal.emerging_topics.map((t) => (
                      <Badge key={t} variant="outline">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium">Opportunity</p>
                <p className="text-sm text-muted-foreground">{signal.opportunity}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Paza Insight</p>
                <p className="text-sm italic text-muted-foreground">{signal.paza_insight.text}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}