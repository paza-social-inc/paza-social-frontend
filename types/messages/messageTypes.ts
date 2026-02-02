// Messaging types for conversations and messages in Inbox

export interface MessageCreateRequest {
  text: string;
  sender: string;
  recipient: string;
}

export interface Message {
  _id?: string;
  text: string;
  sender: string;
  recipient: string;
  createdAt?: string;
}

export interface Conversation {
  _id: string;
  participants: string[];
  lastMessage?: string;
}


