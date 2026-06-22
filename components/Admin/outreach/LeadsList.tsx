import { OutreachLead } from "@/types/outreach"

interface Props {
  leads: OutreachLead[]
  selectedId: string | null
  onSelect: (lead: OutreachLead) => void
}

const angleLabels: Record<string, string> = {
  creator_attribution_gap: 'Creator attribution gap',
  partner_performance_visibility: 'Partner performance visibility',
  affiliate_quality_diagnostics: 'Affiliate quality diagnostics',
  creator_ecosystem_visibility: 'Creator ecosystem visibility',
  ecosystem_diagnostic: 'Ecosystem diagnostic',
  diagnostic_observation: 'Diagnostic observation',
}

const statusConfig: Record<string, { dot: string; label: string }> = {
  new: { dot: 'bg-gray-400', label: 'New' },
  processing: { dot: 'bg-blue-400', label: 'Processing' },
  scanned: { dot: 'bg-yellow-400', label: 'Scanned' },
  approved: { dot: 'bg-blue-500', label: 'Approved' },
  sent: { dot: 'bg-green-500', label: 'Sent' },
  failed: { dot: 'bg-red-400', label: 'Failed' },
}

function ScorePill({ score }: { score: number }) {
  const color =
    score >= 18
      ? 'bg-green-50 text-green-800'
      : score >= 12
      ? 'bg-amber-50 text-amber-800'
      : 'bg-gray-100 text-gray-500'

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>
      {score}
    </span>
  )
}

function initials(name: string | null, domain: string): string {
  if (name) {
    return name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase()
  }
  return domain.slice(0, 2).toUpperCase()
}

export default function LeadsList({ leads, selectedId, onSelect }: Props) {
  return (
    <ul className="divide-y divide-gray-100">
      {leads.map(lead => {
        const isActive = lead.id === selectedId
        const status = statusConfig[lead.status] ?? statusConfig.new
        const message = lead.messages[0] ?? null
        const angle = lead.recommendedAngle
          ? angleLabels[lead.recommendedAngle] ?? lead.recommendedAngle
          : null

        return (
          <li key={lead.id}>
            <button
              onClick={() => onSelect(lead)}
              className={`w-full text-left px-4 py-3 transition-colors ${
                isActive
                  ? 'bg-blue-50 border-l-2 border-blue-500'
                  : 'hover:bg-gray-50 border-l-2 border-transparent'
              }`}
            >
              {/* top row — name + score */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  {/* avatar */}
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {initials(lead.companyName, lead.domain)}
                  </div>
                  <span
                    className={`text-sm font-medium truncate ${
                      isActive ? 'text-blue-700' : 'text-gray-900'
                    }`}
                  >
                    {lead.companyName ?? lead.domain}
                  </span>
                </div>
                <ScorePill score={lead.opportunityScore} />
              </div>

              {/* angle */}
              {angle && (
                <div className="flex items-center gap-1.5 mb-0.5 pl-9">
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status.dot}`}
                  />
                  <span className="text-xs text-gray-500 truncate">{angle}</span>
                </div>
              )}

              {/* subject line */}
              {message && (
                <p className="text-xs text-gray-400 truncate pl-9">
                  {message.subject}
                </p>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}