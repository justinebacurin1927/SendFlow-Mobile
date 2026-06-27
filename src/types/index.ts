export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Contact {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string;
  company: string | null;
  phone: string | null;
  birthday: string | null;
  street: string | null;
  address2: string | null;
  city: string | null;
  region: string | null;
  postal: string | null;
  country: string | null;
  subscribed: boolean;
  permission: boolean;
  tags: Tag[];
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  contacts_count?: number;
  created_at: string;
}

export interface Campaign {
  id: number;
  name: string;
  type: string;
  status: string;
  send_date: string | null;
  sent_at: string | null;
  template: MessageTemplate | null;
  template_id?: number;
  contacts_count: number;
  recipients_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface MessageTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  created_at: string;
  updated_at?: string;
}

export interface DashboardStats {
  total_contacts: number;
  total_subscribers: number;
  subscription_rate: number;
  total_campaigns: number;
  sent_campaigns: number;
  draft_campaigns: number;
  scheduled_campaigns: number;
  total_templates: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_campaigns: Campaign[];
  tags: Tag[];
}

export interface Message {
  id: number;
  source_id: number | null;
  sender_name: string | null;
  sender_email: string | null;
  subject: string | null;
  body: string;
  contact_id: number | null;
  is_read: boolean;
  is_trashed: boolean;
  source_type: string;
  created_at: string;
  updated_at: string;
}

export interface Source {
  id: number;
  email: string;
  created_at: string;
}

export interface Label {
  id: number;
  name: string;
  created_at: string;
}

export interface Automation {
  id: number;
  name: string;
  description: string | null;
  trigger_type: string;
  trigger_config: Record<string, any> | null;
  status: string;
  steps: AutomationStep[];
  created_at: string;
  updated_at: string;
}

export interface AutomationStep {
  id: number;
  automation_id: number;
  order: number;
  delay_days: number;
  action_type: string;
  action_config: Record<string, any> | null;
}

export interface Notification {
  id: string;
  type: string;
  data: Record<string, any>;
  read_at: string | null;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
