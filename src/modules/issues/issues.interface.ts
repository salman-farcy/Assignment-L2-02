export interface CreateIssueRequest {
  title: string;
  description: string;
  type: 'bug' | 'feature_request';
}

export interface UpdateIssueRequest {
  title?: string;
  description?: string;
  type?: 'bug' | 'feature_request';
  status?: 'open' | 'in_progress' | 'resolved';
}

export interface Reporter {
  id: number;
  name: string;
  role: 'contributor' | 'maintainer';
}

export interface IssueResponse {
  id: number;
  title: string;
  description: string;
  type: 'bug' | 'feature_request';
  status: 'open' | 'in_progress' | 'resolved';
  reporter?: Reporter;
  reporter_id?: number;
  created_at: string;
  updated_at: string;
}