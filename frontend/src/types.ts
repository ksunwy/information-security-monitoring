import type { JSX } from 'react';

export interface VulnDistribution {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface AssetStats {
  total: number;
  withVulns: number;
}

export interface SeverityStat {
    severity: string;
    count: number;
}

export interface TopCveStat {
    cveId: string | null;
    count: number;
}

export interface RecentVuln {
    id: string | number;
    cveId: string | null;
    detectedAt: string;
    description: string | null;
}

export interface VulnAnalyticsData {
    total: number;
    bySeverity: SeverityStat[];
    topCve: TopCveStat[];
    recent: RecentVuln[];
}

export interface PieItem {
    name: string;
    value: number;
    [key: string]: string | number;
}

export interface BarItem {
    cve: string;
    count: number;
}

export interface ReportTypeStat {
  type: string;
  count: number;
}

export interface RecentReport {
  id: string | number;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  assetName: string;
}

export interface AnalyticsData {
  total: number;
  byType: ReportTypeStat[];
  recent: RecentReport[];
}

export interface StatusStat {
  status: string;
  count: number;
}

export interface CriticalityStat {
  criticality: string;
  count: number;
}

export interface AssetAnalyticsData {
  total: number;
  withVulns: number;
  byStatus: StatusStat[];
  byCriticality: CriticalityStat[];
}

export interface User {
  id: number;
  email: string;
  login: string;
  name: string;
  role: 'admin' | 'observer' | 'manager';
  createdAt: string;
}

export interface FetchUsersParams {
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  role?: string;
}

export interface FormData {
  email: string;
  login: string;
  name: string;
  password: string;
  role: 'admin' | 'observer' | 'manager';
}

export interface LogEntry {
  id: number;
  type: 'scan' | 'user_activity';
  message: string;
  timestamp: string; 
  user?: {
    id: number;
    login: string;
    name: string;
  } | null;
}

export interface CveDetail {
  id: string;
  sourceIdentifier: string;
  published: string;
  lastModified: string;
  vulnStatus: string;
  descriptions: Array<{
    lang: string;
    value: string;
  }>;
  metrics?: {
    cvssMetricV30?: Array<{
      cvssData: {
        version: string;
        vectorString: string;
        baseScore: number;
        baseSeverity?: string;
      };
      exploitabilityScore?: number;
      impactScore?: number;
    }>;
    cvssMetricV2?: Array<{
      cvssData: {
        version: string;
        vectorString: string;
        baseScore: number;
        baseSeverity?: string;
      };
    }>;
  };
  weaknesses?: Array<{
    description: Array<{ lang: string; value: string }>;
  }>;
  configurations?: {
    nodes?: Array<{
      operator: string;
      negate: boolean;
      cpeMatch?: Array<{
        criteria: string;
        vulnerable: boolean;
      }>;
    }>;
  };
  references?: Array<{
    url: string;
    tags?: string[];
  }>;
}

export interface CveItem {
  cve: {
    id: string;
    sourceIdentifier: string;
    published: string;
    lastModified: string;
    vulnStatus: string;
    descriptions: Array<{ lang: string; value: string }>;
    metrics?: {
      cvssMetricV2?: Array<{
        cvssData: {
          version: string;
          vectorString: string;
          baseScore: number;
          baseSeverity?: string;
        };
        baseSeverity?: string;
      }>;
      cvssMetricV31?: Array<{
        cvssData: {
          version: string;
          vectorString: string;
          baseScore: number;
          baseSeverity?: string;
        };
        baseSeverity?: string;
      }>;
    };
    weaknesses?: Array<{ description: Array<{ lang: string; value: string }> }>;
    configurations?: any;
    references?: Array<{ url: string; tags?: string[] }>;
  };
}

export interface CveListResponse {
  resultsPerPage: number;
  startIndex: number;
  totalResults: number;
  format: string;
  version: string;
  timestamp: string;
  vulnerabilities: CveItem[];
}

export interface CveDetailResponse {
  vulnerabilities: CveItem[];
  totalResults: number;
  cve: CveDetail;
}

export interface AuthState {
  user: AuthResponse['user'] | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (credentials: { login: string; password: string }) => Promise<void>;
  register: (data: { email: string; login: string; name: string; password: string }) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
}

export interface LoginPayload {
  login: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  login: string;
  name: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    login: string;
    name: string;
    role: string;
  };
  token: string;
}

export interface Vulnerability {
  cveId?: string;
  description?: string;
  cvssScore?: number;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  fixed: boolean;
  detectedAt?: string;
}

export interface Scan {
  id: number;
  scannedAt?: string;     
  status?: string;       
  createdAt: string;    
}

export interface Asset {
  id: number;
  ip: string;
  name: string;
  description?: string;           
  group: string;                
  owner: string;                
  criticality: 'low' | 'medium' | 'high' | 'critical';  
  status: 'Онлайн' | 'Оффлайн';                      
  lastScan: string;              
  updatedAt: string;              
  createdAt: string;            
  vulnerabilities: Vulnerability[];  
  scans: Scan[];              
}

export interface FormDataAsset {
  ip: string;
  name: string;
  description: string;
}

export interface AdminVulnDistribution {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface AdminAssetStats {
  total: number;
  withVulns: number;
}

export interface AdminVulnDynamicsEntry {
  period: string;
  new: number;
  fixed: number;
}

export interface AdminVulnDynamics {
  data: AdminVulnDynamicsEntry[];
  granularity: string;
}

export interface AdminRecentVulnerability {
  id: number;
  cveId?: string;
  description?: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  cvssScore: string
}

export interface ProtectedRouteProps {
  children: JSX.Element;
  roles?: string[];
}

export interface FooterProps {
    projectName?: string;
    authorName?: string;
    year?: number;
}