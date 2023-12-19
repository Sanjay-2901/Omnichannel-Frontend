import { ReactElement } from 'react';

export interface LoginResponse {
  access_token: string;
  account_id: number;
  accounts: Accounts[];
  available_name: string;
  avatar_url: string;
  confirmed: boolean;
  display_name: string;
  email: string;
  id: number;
  inviter_id: null;
  message_signature: null;
  name: string;
  provider: string;
  pubsub_token: string;
  role: string;
  type: string;
  ui_settings: { rtl_view: boolean };
  uid: string;
}

interface Accounts {
  active_at: string;
  auto_offline: boolean;
  availability: string;
  availability_status: string;
  id: number;
  name: string;
  role: string;
  status: string;
}

export type ChildrenComponentProps = {
  children: ReactElement;
};

export interface DashBoardState {
  selectedInboxId: number | null;
  selectedConversationId: number | null;
  receivedMessage: WebSocketMessage | null;
  postedMessageId: number | null;
  messageSeenId: number | null;
}

interface MessageData {
  id: number;
  content: string;
  account_id: number;
  inbox_id: number;
  conversation_id: number;
  message_type: number;
  created_at: number;
  updated_at: string;
  private: boolean;
  status: string;
  source_id: string;
  content_type: string;
  content_attributes: Record<string, unknown>;
  sender_type: string;
  sender_id: number;
  external_source_ids: Record<string, unknown>;
  additional_attributes: Record<string, unknown>;
  processed_message_content: string;
  sentiment: Record<string, unknown>;
  conversation: {
    assignee_id: number;
    unread_count: number;
    last_activity_at: number;
    contact_inbox: {
      source_id: string;
    };
  };
  sender: {
    additional_attributes: {
      username: null;
      language_code: string;
    };
    custom_attributes: Record<string, unknown>;
    email: null;
    id: number;
    identifier: null;
    name: string;
    phone_number: null;
    thumbnail: string;
    type: string;
  };
}
interface WebSocketMessage {
  identifier: string;
  message: {
    event: string;
    data: MessageData;
  };
}
