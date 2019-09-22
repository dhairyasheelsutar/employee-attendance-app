import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiService{

    private API_KEY: string = "http://192.168.43.248:4000/";
    constructor(private http: Http){

    }

    get(route: string){
        return this.http.get(this.API_KEY + route)
        .map((response: Response) => response.json())
        .catch((error: Response) => Observable.throw(error.json()));
    }

    post(route: string, data: any){
        return this.http.post(this.API_KEY + route, data)
        .map((response: Response) => response.json())
        .catch((error: Response) => Observable.throw(error.json()));
    }


}
