import { MetadataIF } from './general.interface';

export interface UserIF {
  _id?: string;
  uid?: string;
  username?: string;
  profession?: string;
  primaryMobile?: string;
  primaryEmail?: string;
  profilePictureUrl?: string;
  credits?: UserCreditsIF;
  details?: ResumeDetailsIF;
  metadata?: MetadataIF;
  isAdmin?: boolean;
}

export interface UserCreditsIF {
  assistance?: number;
  mailGenerate?: number;
  resumeDownload?: number;
}

export interface ResumeDetailsIF {
  certification?: CertificationIF[];
  education?: EducationIF[];
  skills?: string[];
  workExperience?: WorkExperienceIF[];
  email?: string;
  linkedinUrl?: string;
  mobile?: string;
  name?: string;
  portfolioUrl?: string;
  profileSummary?: string;
}

export interface CertificationIF {
  name?: string;
  issueDate?: string;
}

export interface EducationIF {
  university?: string;
  degree?: string;
  cgpa?: number;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
}

export interface WorkExperienceIF {
  jobTitle?: string;
  companyName?: string;
  startDate?: string;
  endDate?: string;
  responsibilities?: string;
}

export interface UserFilterIF {
  uid?: (string | undefined)[] | [];
  joinedDate?: string[] | [] | null;
  userType?: string | null;
}

export interface UsersListIF {
  users: UserIF[];
  totalDocCount: number;
  totalMatchedCount: number;
}

