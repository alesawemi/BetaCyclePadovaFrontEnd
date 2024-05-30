import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http'; //modulo injectable, 
import { Observable } from 'rxjs';
import { SalesOrderHeader } from '../models/salesOrderHeader';
import { SalesOrderDetail } from '../models/salesOrderDetail';

@Injectable({
    providedIn: 'root'
})

  export class SalesOrderHttp {
    [x: string]: any;

    constructor(private http: HttpClient) { } 

    private_Url_SalesOrderHeaders = `https://localhost:7228/api/SalesOrderHeaders`;
    private_Url_SalesOrderDetails = `https://localhost:7228/api/SalesOrderDetails`;

    //#region Sales Order Headers

    GetSalesOrderHeaders() : Observable<any>{
        return this.http.get<SalesOrderHeader>(`${this.private_Url_SalesOrderHeaders}`);
    }
  
    GetHeaderById(id: number) : Observable<any>{
    return this.http.get<SalesOrderHeader>(`${this.private_Url_SalesOrderHeaders}/${id}`);
    }

    PostHeader(postHeader: SalesOrderHeader){
    return this.http.post<SalesOrderHeader>(`${this.private_Url_SalesOrderHeaders}`, postHeader);
    }

    UpdateHeaderById(id: number, updHeader: SalesOrderHeader)
    {
    return this.http.put<SalesOrderHeader>(`${this.private_Url_SalesOrderHeaders}/${id}`, updHeader);
    }


    DeleteHeaderById(id: number){
    return this.http.delete<SalesOrderHeader>(`${this.private_Url_SalesOrderHeaders}/${id}`);
    }
    //#endregion


    //#region Sales Order Details

    GetSalesOrderDetails() : Observable<any>{
        return this.http.get<SalesOrderDetail>(`${this.private_Url_SalesOrderDetails}`);
    }
  
    GetDetailById(id: number) : Observable<any>{
    return this.http.get<SalesOrderDetail>(`${this.private_Url_SalesOrderDetails}/${id}`);
    }

    PostDetail(postDetail: SalesOrderDetail){
    return this.http.post<SalesOrderDetail>(`${this.private_Url_SalesOrderDetails}`, postDetail);
    }

    UpdateDetailById(id: number, updDetail: SalesOrderDetail)
    {
    return this.http.put<SalesOrderDetail>(`${this.private_Url_SalesOrderDetails}/${id}`, updDetail);
    }


    DeleteDetailById(id: number){
    return this.http.delete<SalesOrderDetail>(`${this.private_Url_SalesOrderDetails}/${id}`);
    }
    //#endregion


  }