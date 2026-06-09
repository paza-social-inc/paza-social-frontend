'use client'

import { useState } from 'react'
import { OutreachLead, OutreachMessage } from '@/types/outreach'
import EmailBlock from './EmailBlock'
import AutoSendToggle from './AutoSendToggle'

interface Props {
  lead: OutreachLead
  onApprove: (messageId: string) => Promise<void>
  onSend: (messageId: string) => Promise<void>
  onRescan: (leadId: string) => Promise<void>
  onLeadUpdate: (lead: OutreachLead) => void
}

const angleLabels: Record<string, string> = {
  creator_attribution_gap: 'Creator attribution gap',
  partner_performance_visibility: 'Partner performance visibility',
  affiliate_quality_diagnostics: 'Affiliate quality diagnostics',
  creator_ecosystem_visibility: 'Creator ecosystem visibility',
  ecosystem_diagnostic: 'Ecosystem diagnostic',
  diagnostic_observation: 'Diagnostic observation',
}

function ScoreBar({
  label,
  value,
  max,
  color,
}: {
  label: string
  value: number
  max: number
  color: string
}) {
  const pct = Math.round(Math.min((value / max) * 100, 100))
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 w-36 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-6 text-right">{value}</span>
    </div>
  )
}

function initials(name: string | null, domain: string): string {
  if (name) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  }
  return domain.slice(0, 2).toUpperCase()
}

export default function LeadDetail({
  lead,
  onApprove,
  onSend,
  onRescan,
  onLeadUpdate,
}: Props) {
  const [approving, setApproving] = useState(false)
  const [sending, setSending] = useState(false)
  const [rescanning, setRescanning] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const message: OutreachMessage | null = lead.messages[0] ?? null
  const insight = lead.insights[0] ?? null
  const isDraft = message?.status === 'draft'
  const isApproved = message?.status === 'approved'
  const isSent = message?.status === 'sent'

  const handleApprove = async () => {
    if (!message) return
    setApproving(true)
    setActionError(null)
    try {
      await onApprove(message.id)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Approve failed')
    } finally {
      setApproving(false)
    }
  }

  const handleSend = async () => {
    if (!message) return
    setSending(true)
    setActionError(null)
    try {
      await onSend(message.id)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Send failed')
    } finally {
      setSending(false)
    }
  }

  const handleRescan = async () => {
    setRescanning(true)
    setActionError(null)
    try {
      await onRescan(lead.id)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Rescan failed')
    } finally {
      setRescanning(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-sm font-medium text-blue-700 flex-shrink-0">
            {initials(lead.companyName, lead.domain)}
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-900">
              {lead.companyName ?? lead.domain}
            </h2>
            <p className="text-xs text-gray-400">{lead.domain}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* opportunity score */}
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              lead.opportunityScore >= 18
                ? 'bg-green-50 text-green-700'
                : lead.opportunityScore >= 12
                ? 'bg-amber-50 text-amber-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            Score: {lead.opportunityScore}
          </span>

          {/* rescan button */}
          <button
            onClick={handleRescan}
            disabled={rescanning}
            className="text-xs px-3 py-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            {rescanning ? 'Rescanning...' : 'Rescan'}
          </button>
        </div>
      </div>

      {/* scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

        {/* scores */}
        <section>
          <h3 className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-3">
            Scores
          </h3>
          <div className="space-y-2">
            <ScoreBar
              label="Creator maturity"
              value={lead.creatorMaturityScore}
              max={30}
              color="bg-blue-400"
            />
            <ScoreBar
              label="Attribution gap"
              value={lead.attributionGapScore}
              max={7}
              color="bg-amber-400"
            />
            <ScoreBar
              label="Opportunity"
              value={lead.opportunityScore}
              max={37}
              color="bg-green-400"
            />
          </div>
        </section>

        {/* signals */}
        {lead.signals.length > 0 && (
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-3">
              Detected signals ({lead.signals.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {lead.signals.map(signal => (
                <span
                  key={signal.id}
                  title={`${signal.evidence} (confidence: ${Math.round(signal.confidence * 100)}%)`}
                  className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 cursor-default"
                >
                  {signal.signalType.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* insight breakdown */}
        {insight && (
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-3">
              Insight breakdown
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Observed strategy</p>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {insight.observedStrategy}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Likely gap</p>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {insight.likelyGap}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Why now</p>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {insight.whyNow}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Recommended angle</p>
                <p className="text-xs text-blue-600 leading-relaxed">
                  {lead.recommendedAngle
                    ? angleLabels[lead.recommendedAngle] ?? lead.recommendedAngle
                    : '—'}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* email draft */}
        {message && (
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-3">
              Crafted outreach
            </h3>
            <EmailBlock
              lead={lead}
              message={message}
              onLeadUpdate={onLeadUpdate}
              isSent={isSent}
            />
          </section>
        )}

        {/* no message yet */}
        {!message && (
          <div className="text-sm text-gray-400 bg-gray-50 rounded-lg p-4 text-center">
            No draft generated yet — rescan to trigger the agent.
          </div>
        )}

        {/* action error */}
        {actionError && (
          <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-md">
            {actionError}
          </p>
        )}
      </div>

      {/* action bar — pinned to bottom */}
      {message && !isSent && (
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-3 flex items-center gap-3">
          {isDraft && (
            <button
              onClick={handleApprove}
              disabled={approving}
              className="text-sm px-4 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 font-medium hover:bg-green-100 disabled:opacity-40 transition-colors"
            >
              {approving ? 'Approving...' : 'Approve'}
            </button>
          )}

          <button
            onClick={handleSend}
            disabled={sending || isDraft}
            className="text-sm px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-medium hover:bg-blue-100 disabled:opacity-40 transition-colors"
          >
            {sending ? 'Sending...' : 'Send now'}
          </button>

          <div className="ml-auto">
            <AutoSendToggle
              lead={lead}
              onLeadUpdate={onLeadUpdate}
            />
          </div>
        </div>
      )}

      {/* sent state */}
      {isSent && (
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm text-gray-500">Email sent successfully</span>
          {message.sentAt && (
            <span className="text-xs text-gray-400 ml-1">
              · {new Date(message.sentAt).toLocaleDateString()}
            </span>
          )}
        </div>
      )}
    </div>
  )
}