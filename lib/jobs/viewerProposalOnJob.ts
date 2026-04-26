/** Shape returned on job detail `proposals` from the public job API. */
export type JobProposalListItem = {
  id?: number;
  proposer_id?: number;
  proposer?: { id?: number | string };
  status?: string;
  title?: string;
};

export function getViewerProposalOnJob(
  proposals: JobProposalListItem[] | null | undefined,
  viewerId: number
): JobProposalListItem | null {
  if (!Number.isFinite(viewerId) || viewerId <= 0 || !proposals?.length) {
    return null;
  }
  for (const p of proposals) {
    const fromColumn =
      p.proposer_id != null && Number.isFinite(Number(p.proposer_id))
        ? Number(p.proposer_id)
        : NaN;
    const fromNested =
      p.proposer?.id != null && String(p.proposer.id).trim() !== ""
        ? Number(p.proposer.id)
        : NaN;
    const pid = Number.isFinite(fromColumn) ? fromColumn : fromNested;
    if (Number.isFinite(pid) && pid === viewerId) return p;
  }
  return null;
}
