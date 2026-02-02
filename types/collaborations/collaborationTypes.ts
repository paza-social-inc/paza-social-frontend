// Collaboration types used around referrals/invites and project collabs

export interface CollaborationInvite {
  email?: string;
  note?: string;
}

export interface Collaboration {
  _id: string;
  [key: string]: any;
}


