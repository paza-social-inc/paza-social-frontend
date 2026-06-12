'use client'

import { useState, useEffect, useCallback } from 'react';
import { OutreachLead, LeadStatus } from '@/types/outreach'
import { outreachApi } from '@/components/Admin/outreach/lib/api';
import LeadsList from '@/components/Admin/outreach/LeadsList';
import LeadDetail from '@/components/Admin/outreach/LeadDetail';

export default function OutreachPage() {
  const [leads, setLeads] = useState<OutreachLead[]>([])
  const [selectedLead, setSelectedLead] = useState<OutreachLead | null>(null)
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    try {
      setError(null)
      const data = await outreachApi.getLeads(filter === 'all' ? undefined : filter)
      setLeads(data.leads)

      // keep selected lead in sync after refetch
      if (selectedLead) {
        const refreshed = data.leads.find(l => l.id === selectedLead.id)
        setSelectedLead(refreshed ?? null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }, [filter, selectedLead])

  useEffect(() => {
    setLoading(true)
    fetchLeads()
  }, [filter])

  const handleSelectLead = async (lead: OutreachLead) => {
    console.log('lead keys:', Object.keys(lead), 'id value:', lead.id)
    try {
        const full = await outreachApi.getLead(lead.id)
        setSelectedLead(full)
    } catch {
        setSelectedLead(lead)
    }
  }

  const handleApprove = async (messageId: string) => {
    await outreachApi.approveMessage(messageId)
    await fetchLeads()

    // refresh selected lead so UI reflects approved status immediately
    if (selectedLead) {
      try {
        const full = await outreachApi.getLead(selectedLead.id)
        setSelectedLead(full)
      } catch {
        /* ignore */
      }
    }
  }

  const handleSend = async (messageId: string) => {
    await outreachApi.sendMessage(messageId)
    await fetchLeads()

    // refresh selected lead so UI reflects sent status immediately
    if (selectedLead) {
      try {
        const full = await outreachApi.getLead(selectedLead.id)
        setSelectedLead(full)
      } catch {
        /* ignore */
      }
    }
  }

  const handleRescan = async (leadId: string) => {
    await outreachApi.rescanLead(leadId)
    await fetchLeads()
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* left panel - hidden on mobile when detail is shown */}
      <div className={`${selectedLead ? 'hidden' : 'flex'} md:flex w-full md:w-80 flex-shrink-0 border-r border-gray-200 bg-white flex-col`}>
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-sm font-medium text-gray-900">Outreach leads</h1>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {leads.length} leads
          </span>
        </div>

        {/* filter tabs */}
        <div className="flex gap-1.5 px-3 py-2 border-b border-gray-200 flex-wrap">
          {(['all', 'new', 'scanned', 'approved', 'sent'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                filter === f
                  ? 'bg-gray-100 text-gray-900 border-gray-300'
                  : 'text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* list body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">
              Loading leads...
            </div>
          ) : error ? (
            <div className="p-4 text-sm text-red-500">
              {error}
              <button
                onClick={fetchLeads}
                className="block mt-2 text-xs text-gray-500 underline"
              >
                Retry
              </button>
            </div>
          ) : leads.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">
              No leads found
            </div>
          ) : (
            <LeadsList
              leads={leads}
              selectedId={selectedLead?.id ?? null}
              onSelect={handleSelectLead}
            />
          )}
        </div>
      </div>

      {/* right panel - hidden on mobile when no lead is selected */}
      <div className={`${selectedLead ? 'flex' : 'hidden'} md:flex flex-1 overflow-hidden`}>
        {selectedLead ? (
          <div className="flex flex-col w-full h-full">
            {/* mobile back button */}
            <div className="md:hidden flex items-center px-4 py-3 border-b border-gray-200 bg-white">
              <button
                onClick={() => setSelectedLead(null)}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <LeadDetail
                lead={selectedLead}
                onApprove={handleApprove}
                onSend={handleSend}
                onRescan={handleRescan}
                onLeadUpdate={setSelectedLead}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-400 flex-col gap-2">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Select a lead to review
          </div>
        )}
      </div>
    </div>
  )
}