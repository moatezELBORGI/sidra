import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormData } from '../models/FormData';

@Injectable({
    providedIn: 'root'
})
export class FormDataService {
    private apiUrl = 'http://localhost:4002/forms';

    constructor(private http: HttpClient) {}

    getForms(): Observable<FormData[]> {
        return this.http.get<FormData[]>(this.apiUrl);
    }

    getFormById(id: string): Observable<FormData> {
        return this.http.get<FormData>(`${this.apiUrl}/${id}`);
    }

    addForm(formData: {
        governorat: any;
        structure: any;
        structureInfo: any;
        tobaccoAlcohol: any;
        substanceUse: any;
        behaviorsAndTests: any;
        comorbidities: any;
        spaDeaths: any;
        status: string
    }): Observable<FormData> {
        const code = 'FORM-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        const dateAjout = new Date().toISOString();

        return this.http.post<FormData>(this.apiUrl, {
            ...formData,
            code,
            dateAjout,
        });
    }

    updateForm(id: string, formData: {
        governorat: any;
        structure: any;
        structureInfo: any;
        tobaccoAlcohol: any;
        substanceUse: any;
        behaviorsAndTests: any;
        comorbidities: any;
        spaDeaths: any;
        status: string
    }): Observable<FormData> {
        return this.http.patch<FormData>(`${this.apiUrl}/${id}`, formData);
    }
}
