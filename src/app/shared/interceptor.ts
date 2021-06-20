import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { tap, map, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { Router } from '@angular/router';

@Injectable()
export class Interceptor implements HttpInterceptor {
    constructor(
        private router: Router
    ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (localStorage.getItem('token') != null) {
            const token = localStorage.getItem('token');
            // if the token is  stored in localstorage add it to http header
            const cloned = request.clone({
                headers: request.headers.set("token",
                    token)
            });
            //clone http to the custom AuthRequest and send it to the server 
            return next.handle(cloned).pipe(
                map((event: HttpResponse<any>) => {
                    return event;
                }),
                catchError((error: HttpErrorResponse) => {
                    const errorMessage = error.error;
                    if (error.status === 401) {
                        localStorage.clear();
                        this.router.navigate(['/auth/login']);
                    }
                    return throwError(error);
                })
            );
        } else {
            return next.handle(request).pipe(
                map((event: HttpResponse<any>) => {
                    return event;
                }),
                catchError((error: HttpErrorResponse) => {
                    const errorMessage = error.error;
                    if (error.status === 401) {
                        localStorage.clear();
                        this.router.navigate(['/auth/login']);
                    }
                    return throwError(error);
                })
            );;
        }
    }
}