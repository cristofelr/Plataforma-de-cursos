
export enum EducationLevel {
  PRIMARY = 'Ensino Fundamental',
  SECONDARY = 'Ensino Médio',
  HIGHER = 'Ensino Superior',
  POSTGRAD = 'Pós-Graduação'
}

export enum SelectionCriteria {
  AGE_DESC = 'Maior Idade (Prioridade aos mais velhos)',
  AGE_ASC = 'Menor Idade (Prioridade aos mais jovens)',
  EDUCATION_HIGH = 'Maior Escolaridade',
  FIRST_COME = 'Ordem de Inscrição'
}

export enum CourseStatus {
  OPEN = 'Abertas',
  CLOSED = 'Fechadas',
  IN_PROGRESS = 'Em Andamento'
}

export enum EnrollmentStatus {
  PENDING = 'Pendente',
  SELECTED = 'Selecionado',
  REJECTED = 'Não Selecionado'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string; // Used for WhatsApp
  address?: string;
  education?: EducationLevel;
  age?: number;
  gender?: 'M' | 'F';
}

export interface Professor {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  lattesUrl?: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  startDate: string;
  status: CourseStatus;
  criteria: SelectionCriteria;
  imageUrl: string;
  category: string;
  prerequisites?: string;
  minAge?: number;
  professorId?: string;
  hasPartnership?: boolean;
  partnerName?: string;
  whatsappUrl?: string;
  classroomUrl?: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  status: EnrollmentStatus;
  timestamp: number;
}