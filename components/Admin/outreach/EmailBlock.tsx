'use client'

import { useState, useEffect } from 'react'
import { OutreachLead, OutreachMessage } from '@/types/outreach' 
import { outreachApi } from '@/components/Admin/outreach/lib/api'; 

interface Props {
  lead: OutreachLead
  message: OutreachMessage
  onLeadUpdate: (lead: OutreachLead) => void
  isSent: boolean
}

export default function EmailBlock({ lead, message, onLeadUpdate, isSent }: Props) {
  const [email, setEmail] = useState(lead.contactEmail ?? '')
  useEffect(() => {
    setEmail(lead.contactEmail ?? '')
  }, [lead.id])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleEmailSave = async () => {
    if (!email.trim()) return
    setSaving(true)
    setSaved(false)
    setSaveError(null)
    try {
      // will update lead with contact email via upsert
      const updated = await outreachApi.createLead({
        domain: lead.domain,
        companyName: lead.companyName ?? undefined,
        country: lead.country ?? undefined,
        contactEmail: email.trim(),
      })
      onLeadUpdate({ ...lead, contactEmail: updated.contactEmail })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save email')
    } finally {
      setSaving(false)
    }
  }

  const statusConfig: Record<string, { label: string; className: string }> = {
    draft: { label: 'Draft', className: 'bg-amber-50 text-amber-700' },
    approved: { label: 'Approved', className: 'bg-blue-50 text-blue-700' },
    sending: { label: 'Sending...', className: 'bg-gray-100 text-gray-500' },
    sent: { label: 'Sent', className: 'bg-green-50 text-green-700' },
    failed: { label: 'Failed', className: 'bg-red-50 text-red-600' },
  }

  const status = statusConfig[message.status] ?? statusConfig.draft

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">

      {/* email header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <span className="text-xs font-medium text-gray-600">Draft email</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.className}`}>
          {status.label}
        </span>
      </div>

      {/* to field */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100">
        <span className="text-xs text-gray-400 w-12 flex-shrink-0">To</span>
        {isSent ? (
          <span className="text-xs text-gray-700">{lead.contactEmail ?? '—'}</span>
        ) : (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Add contact email..."
              className="flex-1 text-xs text-gray-700 bg-transparent outline-none placeholder-gray-300 min-w-0"
            />
            {email !== (lead.contactEmail ?? '') && (
              <button
                onClick={handleEmailSave}
                disabled={saving}
                className="text-xs px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 disabled:opacity-40 transition-colors flex-shrink-0"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            )}
            {saved && (
              <span className="text-xs text-green-600 flex-shrink-0">Saved</span>
            )}
          </div>
        )}
      </div>

      {/* save error */}
      {saveError && (
        <div className="px-4 py-1.5 bg-red-50 border-b border-red-100">
          <p className="text-xs text-red-500">{saveError}</p>
        </div>
      )}

      {/* no email warning */}
      {!lead.contactEmail && !isSent && (
        <div className="px-4 py-1.5 bg-amber-50 border-b border-amber-100 flex items-center gap-1.5">
          <svg className="w-3 h-3 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-xs text-amber-600">
            Email not extracted yet — add manually to enable sending
          </span>
        </div>
      )}

      {/* subject */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100">
        <span className="text-xs text-gray-400 w-12 flex-shrink-0">Subject</span>
        <span className="text-xs text-gray-700 truncate">{message.subject}</span>
      </div>

      {/* body */}
      <div className="px-4 py-3 max-h-48 overflow-y-auto">
        <pre className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap font-sans">
          {message.body}
        </pre>
      </div>
    </div>
  )
}