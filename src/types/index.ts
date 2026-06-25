export interface User {
  id: number;
  name: string;
  email: string;
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
  created_at: string;
}

export interface Campaign {
  id: number;
  name: string;
  type: string;
  status: string;
  send_date: string | null;
  template: MessageTemplate | null;
  contacts_count: number;
  recipients_count: number;
  created_at: string;
  updated_at: string;
}

export interface MessageTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  created_at: string;
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

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
