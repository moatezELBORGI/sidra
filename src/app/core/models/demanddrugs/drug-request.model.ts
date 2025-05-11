export interface DrugRequest {
  id: number;
  nationalId: string;
  sector: string;
  ministry: string;
  structure: string;
  patientCode: string;
  status: 'pending' | 'approved' | 'rejected';
}