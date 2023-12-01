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
