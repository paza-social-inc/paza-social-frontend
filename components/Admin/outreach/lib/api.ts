import { LeadsResponse, OutreachLead, ApproveResponse, SendResponse } from "@/types/outreach"

const BASE_URL = process.env.NEXT_PUBLIC_AGENT_API_URL ?? 'http://localhost:4000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`[${res.status}] ${path} — ${body}`)
  }

  return res.json() as Promise<T>
}

export const outreachApi = {
  getLeads(status?: string): Promise<LeadsResponse> {
    const query = status ? `?status=${status}` : ''
    return request<LeadsResponse>(`/api/leads${query}`)
  },

  getLead(id: string): Promise<OutreachLead> {
    return request<OutreachLead>(`/api/leads/${id}`)
  },

  createLead(data: {
    domain: string
    companyName?: string
    country?: string
    contactEmail?: string
  }): Promise<OutreachLead> {
    return request<OutreachLead>('/api/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  rescanLead(id: string): Promise<OutreachLead> {
    return request<OutreachLead>(`/api/leads/${id}/rescan`, {
      method: 'POST',
    })
  },

  approveMessage(messageId: string): Promise<ApproveResponse> {
    return request<ApproveResponse>(`/api/messages/${messageId}/approve`, {
      method: 'POST',
    })
  },

  sendMessage(messageId: string): Promise<SendResponse> {
    return request<SendResponse>(`/api/messages/${messageId}/send`, {
      method: 'POST',
    })
  },
}