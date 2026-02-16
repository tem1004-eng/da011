
export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood?: string;
  aiAnalysis?: AIAnalysis;
}

export interface AIAnalysis {
  sentiment: string;
  summary: string;
  reflection: string;
  tags: string[];
}

export enum ViewMode {
  LIST = 'LIST',
  EDIT = 'EDIT',
  VIEW = 'VIEW'
}
