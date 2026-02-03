import { MetadataIF } from './general.interface';

export interface AssistanceIF {
  _id?: string;
  transactionId?: string;
  progressStatus?: string;
  stage?: string;
  notes?: string;
  attempt1Comment?: string;
  attempt2Comment?: string;
  attempt3Comment?: string;
  metadataCreate?: MetadataIF;
  metadataUpdate?: MetadataIF;
}

export interface AssistanceFilterIF {
  uid?: string[] | [] | null;
  progressStatus?: string | null;
  recentlyModified?: boolean | null;
  stage?: string[] | [] | null;
  requestedOn?: string[] | [] | null;
}

export interface AssistanceListIF {
  assistanceRequests: AssistanceIF[];
  totalCount: number;
}

export enum StageEnum {
  notInitiated = 'Not Initiated',
  attempt1 = 'First Attempt',
  attempt2 = 'Second Attempt',
  attempt3 = 'Third Attempt',
  detailsCollected = 'Details Collected',
  resumeCreated = 'Resume Created',
  mailSent = 'Mail Sent',
}

export enum ProgressStatusEnum {
  open = 'Open',
  completed = 'Completed',
  cancelled = 'Cancelled',
}


