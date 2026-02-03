export interface MetadataIF {
  at?: string | null;
  by?: string | null;
  action?: string | null;
}

export interface SortIF {
  sortBy?: string | null;
  sortIn?: string | null;
}

export interface DropDownIF {
  name: string;
  code: string;
  other?: any;
}

export interface MailDataIF {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  html: string;
}


