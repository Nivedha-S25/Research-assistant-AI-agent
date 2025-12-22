
export enum Sender {
  USER = 'USER',
  AI = 'AI'
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: Date;
}

export interface SessionData {
  messages: Message[];
  context: string;
  currentFileName: string | null;
}
