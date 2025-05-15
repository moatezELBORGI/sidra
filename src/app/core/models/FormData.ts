export interface FormData {
    id: string;
    code: string;
    dateAjout: string;
    status: 'pending' | 'approved' | 'rejected';
    governorat: string;
    structure: string;
    structureInfo: any;
    tobaccoAlcohol: any;
    substanceUse: any;
    behaviorsAndTests: any;
    comorbidities: any;
    spaDeaths: any;
}
