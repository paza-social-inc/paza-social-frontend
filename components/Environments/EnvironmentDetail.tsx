'use client';

import { EnvironmentProfile } from '@/types/environment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ERIBadge } from './ERIBadge';
import { SignalTable } from './SignalTable';
import { TrendChart } from './TrendChart';
import { Badge } from '@/components/ui/badge';

interface EnvironmentDetailProps {
  environment: EnvironmentProfile;
}

export function EnvironmentDetail({ environment }: EnvironmentDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{environment.name}</h1>
          <div className="flex gap-2 mt-1 text-muted-foreground">
            <Badge variant="outline">{environment.type}</Badge>
            <span>{environment.location}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">ERI Score</p>
            <ERIBadge score={environment.eriScore} />
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {environment.topics.map((t) => (
                <Badge key={t} variant="secondary">{t}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {environment.conditions.map((c) => (
                <Badge key={c} variant="secondary">{c}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Behaviors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {environment.behaviors.map((b) => (
                <Badge key={b} variant="secondary">{b}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Signal Diversity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{environment.signalDiversity}</p>
            <p className="text-xs text-muted-foreground">unique posters (30d)</p>
          </CardContent>
        </Card>
      </div>

      {/* Friction breakdown + recent trend */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Friction Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(environment.frictionBreakdown).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="w-24 capitalize text-sm">{key}</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">{value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity Trend (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart data={environment.activityTimeSeries} />
          </CardContent>
        </Card>
      </div>

      {/* Signal table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Signals</CardTitle>
        </CardHeader>
        <CardContent>
          <SignalTable signals={environment.signals} />
        </CardContent>
      </Card>

      {/* Recommended activation */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Activation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>{environment.recommendedActivation}</p>
          <div className="text-sm text-muted-foreground">
            <p>Accessibility: {environment.accessibility}</p>
            <p>Estimated reach: {environment.estimatedReach}</p>
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <p className="text-xs text-muted-foreground">
        Last scanned: {new Date(environment.lastScanned).toLocaleDateString()}
      </p>
    </div>
  );
}