import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogTrace } from '../models/LogTraceData';

@Injectable({
  providedIn: 'root'
})

export class LogtraceService {

  constructor(private http: HttpClient) { }

  PostError(errorInfo: LogTrace) : Observable<any>{
    return this.http.post(`https://localhost:7228/api/FrontendErrors`, errorInfo)
  }
}
