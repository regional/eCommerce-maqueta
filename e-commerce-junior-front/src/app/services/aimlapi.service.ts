import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AimlService {
  private apiUrl = '/api/chat'; // Ruta relativa para usar el proxy

  constructor(private http: HttpClient) {}

  getChatResponse(requestBody: any): Observable<any> {
    console.log('Haciendo solicitud a:', this.apiUrl);
    return this.http.post(this.apiUrl, requestBody, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
