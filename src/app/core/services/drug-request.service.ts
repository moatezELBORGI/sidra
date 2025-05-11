import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DrugRequest } from '../models/demanddrugs/drug-request.model';
import {environment} from "../../../../environment";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class DrugRequestService {
  // Mock data for demonstration
  private mockRequests: DrugRequest[] = [
    {
      id: 1,
      nationalId: 'TN12345678',
      sector: 'Public',
      ministry: 'Santé',
      structure: 'Hôpital Charles Nicolle',
      patientCode: 'P001',
      status: 'pending'
    },
    {
      id: 2,
      nationalId: 'TN23456789',
      sector: 'Public',
      ministry: 'Santé',
      structure: 'Hôpital Habib Thameur',
      patientCode: 'P002',
      status: 'approved'
    },
    {
      id: 3,
      nationalId: 'TN34567890',
      sector: 'Privé',
      ministry: 'N/A',
      structure: 'Clinique Les Jasmins',
      patientCode: 'P003',
      status: 'rejected'
    },
    {
      id: 4,
      nationalId: 'TN45678901',
      sector: 'Public',
      ministry: 'Santé',
      structure: 'Hôpital Mongi Slim',
      patientCode: 'P004',
      status: 'pending'
    },
    {
      id: 5,
      nationalId: 'TN56789012',
      sector: 'Privé',
      ministry: 'N/A',
      structure: 'Clinique El Manar',
      patientCode: 'P005',
      status: 'approved'
    }
  ];

  getRequests(): Observable<DrugRequest[]> {
    // Simulate API call
    return of(this.mockRequests).pipe(delay(500));
  }

  getRequestById(id: number): Observable<DrugRequest | undefined> {
    const request = this.mockRequests.find(req => req.id === id);
    return of(request).pipe(delay(300));
  }

  addRequest(request: Omit<DrugRequest, 'id'>): Observable<DrugRequest> {
    const newRequest: DrugRequest = {
      ...request,
      id: this.getNextId()
    };
    
    this.mockRequests.push(newRequest);
    
    return of(newRequest).pipe(delay(500));
  }

  private getNextId(): number {
    return Math.max(...this.mockRequests.map(req => req.id), 0) + 1;
  }
  private readonly baseApiUrl=environment.apiUrl+"/Drugs/"
  private headers!:HttpHeaders;
  private accessToken!:string;
  private timezone!:string;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.accessToken = this.cookieService.get('access_token');
    this.timezone = this.cookieService.get('timeZone');

    // Configurer les headers
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'Timezone': this.timezone
    });
  }
  getConsultancyFrameDtoList(): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(`${this.baseApiUrl}getConsultancyFrameDtoList`,{ headers: this.headers , observe: 'response'});
  }
  getOriginOfDemandDtoList(): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(`${this.baseApiUrl}getOriginOfDemandDtoList`,{ headers: this.headers , observe: 'response'});
  }
  getReasonForRecidivismDto(): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(`${this.baseApiUrl}getReasonForRecidivismDto`,{ headers: this.headers , observe: 'response'});
  }
  getConsultancyMotifDto(): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(`${this.baseApiUrl}getConsultancyMotifDto`,{ headers: this.headers , observe: 'response'});
  }
  getReasonForWithdrawalDto(): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(`${this.baseApiUrl}getReasonForWithdrawalDto`,{ headers: this.headers , observe: 'response'});
  }
  getFamilySituationDtoList(): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(`${this.baseApiUrl}getFamilySituationDtoList`,{ headers: this.headers , observe: 'response'});
  }
  getAccommodationTypeDtoList(): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(`${this.baseApiUrl}getAccommodationTypeDtoList`,{ headers: this.headers , observe: 'response'});
  }
  getProfessionDtoList(): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(`${this.baseApiUrl}getProfessionDtoList`,{ headers: this.headers , observe: 'response'});
  }
  getSchoolLevelDtoList(): Observable<HttpResponse<any[]>> {
  return this.http.get<any[]>(`${this.baseApiUrl}getSchoolLevelDtoList`,{ headers: this.headers , observe: 'response'});
}
  getConsumptionFrequencyDtoListWithType1(): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(`${this.baseApiUrl}getConsumptionFrequencyDtoList/1`,{ headers: this.headers , observe: 'response'});
  }
}
