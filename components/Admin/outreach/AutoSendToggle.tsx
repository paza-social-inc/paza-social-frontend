'use client'

import { useState } from 'react'
import { OutreachLead } from '@/types/outreach'

interface Props {
  lead: OutreachLead
  onLeadUpdate: (lead: OutreachLead) => void
}

const AUTO_SEND_THRESHOLD = 15

export default function AutoSendToggle({ lead, onLeadUpdate }: Props) {
  // auto-send is on if score >= threshold — stored locally until backend supports it
  const [enabled, setEnabled] = useState(
    lead.opportunityScore >= AUTO_SEND_THRESHOLD
  )

  const handleToggle = () => {
    const next = !enabled
    setEnabled(next)
    // optimistic update — wire to backend when the field is added
    onLeadUpdate({ ...lead })
  }

  const meetsThreshold = lead.opportunityScore >= AUTO_SEND_THRESHOLD

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-xs text-gray-400">Auto-send</span>

      {/* toggle track */}
      <button
        role="switch"
        aria-checked={enabled}
        aria-label="Toggle auto-send"
        onClick={handleToggle}
        className={`relative w-8 h-4.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 ${
          enabled ? 'bg-blue-500' : 'bg-gray-200'
        }`}
        style={{ height: '18px', width: '32px' }}
      >
        <span
          className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${
            enabled ? 'translate-x-4' : 'translate-x-0.5'
          }`}
          style={{ height: '14px', width: '14px' }}
        />
      </button>

      {/* context label */}
      <span className="text-xs text-gray-400">
        {enabled
          ? `On · score ${lead.opportunityScore} ≥ ${AUTO_SEND_THRESHOLD}`
          : meetsThreshold
          ? `Off · score qualifies (${lead.opportunityScore})`
          : `Off · score ${lead.opportunityScore} < ${AUTO_SEND_THRESHOLD}`}
      </span>
    </div>
  )
}