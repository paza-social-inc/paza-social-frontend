import { Community } from '@/types/social-listener';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CommunityCardProps {
  community: Community;
}

export function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{community.name}</CardTitle>
          <Badge variant="outline">{community.platform}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Activity: {community.activity_level}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Why this community</p>
          <p className="text-sm text-muted-foreground">{community.summary.why_selected}</p>
        </div>

        <div>
          <p className="text-sm font-medium">Primary Members</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {community.members.map((m) => (
              <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">Main Interests</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {community.interests.map((i) => (
              <Badge key={i} variant="secondary" className="text-xs">{i}</Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">Top Discussion Themes</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {community.discussion_themes.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        {community.evidence.length > 0 && (
          <div>
            <p className="text-sm font-medium">Evidence</p>
            <div className="space-y-1 mt-1">
              {community.evidence.map((e, i) => (
                <div key={i} className="text-sm text-muted-foreground border-l-2 pl-2 italic">
                  “{e.text}”
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-medium">Community Characteristics</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {community.characteristics.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        {community.related_creators.length > 0 && (
          <div>
            <p className="text-sm font-medium">Related Creators</p>
            <p className="text-sm text-muted-foreground">{community.related_creators.join(', ')}</p>
          </div>
        )}

        <div>
          <p className="text-sm font-medium">Paza Insight</p>
          <p className="text-sm italic text-muted-foreground">{community.paza_insight.text}</p>
        </div>
      </CardContent>
    </Card>
  );
}