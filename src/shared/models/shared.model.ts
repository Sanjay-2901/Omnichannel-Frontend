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
  showInboxes: boolean;
  searchedMessageId: number | null;
  assigneeType: string;
}

export interface ConversationDetail {
  inbox_name: string;
  conversation_status: string;
  channel_type: string;
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

export type IconKey = 'Telegram' | 'Email' | 'WebWidget';

export interface Inbox {
  id: number;
  avatar_url: string;
  channel_id: number;
  name: string;
  channel_type: string;
  greeting_enabled: boolean;
  greeting_message: string | null;
  working_hours_enabled: boolean;
  enable_email_collect: boolean;
  csat_survey_enabled: boolean;
  enable_auto_assignment: boolean;
  auto_assignment_config: Record<string, any>;
  out_of_office_message: string | null;
  timezone: string;
  callback_webhook_url: string | null;
  allow_messages_after_resolved: boolean;
  lock_to_single_conversation: boolean;
  sender_name_type: string;
  business_name: string | null;
  widget_color: string | null;
  website_url: string | null;
  hmac_mandatory: string | null;
  welcome_title: string | null;
  welcome_tagline: string | null;
  web_widget_script: string | null;
  website_token: string | null;
  selected_feature_flags: Record<string, any> | null;
  reply_time: string | null;
  messaging_service_sid: string | null;
  phone_number: string | null;
  provider: string | null;
}

export interface Conversation {
  meta: {
    sender: {
      additional_attributes: {
        username: null | string;
        language_code: string;
      };
      availability_status: string;
      email: null | string;
      id: number;
      name: string;
      phone_number: null | string;
      identifier: null | string;
      thumbnail: string;
      custom_attributes: Record<string, any>;
      last_activity_at: number;
      created_at: number;
    };
    channel: string;
    assignee: {
      id: number;
      account_id: number;
      availability_status: string;
      auto_offline: boolean;
      confirmed: boolean;
      email: string;
      available_name: string;
      name: string;
      role: string;
      thumbnail: string;
    };
    hmac_verified: boolean;
  };
  id: number;
  messages: Message[];
  account_id: number;
  uuid: string;
  additional_attributes: {
    chat_id: number;
  };
  agent_last_seen_at: number;
  assignee_last_seen_at: number;
  can_reply: boolean;
  contact_last_seen_at: number;
  custom_attributes: Record<string, any>;
  inbox_id: number;
  labels: string[];
  muted: boolean;
  snoozed_until: null | string;
  status: string;
  created_at: number;
  timestamp: number;
  first_reply_created_at: number;
  unread_count: number;
  last_non_activity_message: Message;
  last_activity_at: number;
  priority: null | string;
  waiting_since: number;
}

interface Message {
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
  content_attributes: Record<string, any>;
  sender_type: string;
  sender_id: number;
  external_source_ids: Record<string, any>;
  additional_attributes: Record<string, any>;
  processed_message_content: string;
  sentiment: {
    label: string;
    score: number;
    value: number;
  };
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
      username: null | string;
      language_code: string;
    };
    custom_attributes: Record<string, any>;
    email: null | string;
    id: number;
    identifier: null | string;
    name: string;
    phone_number: null | string;
    thumbnail: string;
    type: string;
  };
}

export interface SearchMessageResult {
  payload: {
    messages: SearchMessage[];
  };
}

export interface SearchMessage {
  id: number;
  content: string;
  message_type: number;
  content_type: string;
  source_id: string;
  inbox_id: number;
  conversation_id: number;
  created_at: number;
  sender: {
    additional_attributes: {
      username: string;
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
  inbox: {
    id: number;
    channel_id: number;
    name: string;
    channel_type: string;
  };
}

export interface SearchConversationResult {
  payload: {
    conversations: ConversationResult[];
  };
}

export interface ConversationResult {
  id: number;
  account_id: number;
  created_at: number;
  message: SearchMessage;
  contact: Contact;
  inbox: InboxSearch;
  agent: Agent;
}

interface Contact {
  email: null | string;
  id: number;
  name: string;
  phone_number: null | string;
  identifier: null | string;
}

interface InboxSearch {
  id: number;
  channel_id: number;
  name: string;
  channel_type: string;
}

interface Agent {
  id: number;
  available_name: string;
  email: string;
  name: string;
  role: string;
}
