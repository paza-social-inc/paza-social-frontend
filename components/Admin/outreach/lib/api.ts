import { LeadsResponse, OutreachLead, ApproveResponse, SendResponse } from "@/types/outreach"

const BASE_URL = process.env.NEXT_PUBLIC_AGENT_API_URL ?? (() => {
  throw new Error('NEXT_PUBLIC_AGENT_API_URL is not set')
})()

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

  async getLead(id: string): Promise<OutreachLead> {
    const res = await request<{ lead: OutreachLead }>(`/api/leads/${id}`)
    return res.lead
  },


  async createLead(data: {
    domain: string
    companyName?: string
    country?: string
    contactEmail?: string
  }): Promise<OutreachLead> {
    const res = await request<{ lead: OutreachLead }>('/api/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return res.lead
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