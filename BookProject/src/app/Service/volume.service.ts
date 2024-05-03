import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, catchError } from 'rxjs';
import { Volume } from '../Model/Volume'
import { VolProgress } from '../Model/VolProgress';


export interface ErrorResponse {
    error: {
        code: number;
        message: string;
    }

}

@Injectable({
    providedIn: 'root'
})
export class VolumeService {

    private readonly apiUrl = environment.apiUrl + "Volumes/";

    constructor(private http: HttpClient) { }

    getBookVolumes(bookId: number): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}GetBookVol`, { params: { BookId: bookId } });
  }


    CreateBookVolume(bookId: number, volNum: number) {
        let body = JSON.stringify({
            bookId: bookId,
            volNumber: volNum
        })

        let headers = { 'content-type': 'application/json' }

        let data = this.http.post<Volume>(`${this.apiUrl}CreateVol`, body, { 'headers': headers });
        return data;
    }

    GetVolumeProgress(volumeId: number, accountId: number, bookId?: number): Observable<VolProgress> {
        let data = new Observable<VolProgress>();


        data = this.http.get<VolProgress>(`${this.apiUrl}GetVolProgress?accountId=${accountId}&volId=${volumeId}`).pipe(
            (response) => {
                console.log(response);
                return response;

            },
            catchError((error) => {
                console.log({GetError: error});

                if (!bookId) return new Observable<VolProgress>();
                if (error.status == 404) {
                    console.log('Volume progress not found, creating new progress');
                    this.CreateVolumeProgress(volumeId, accountId, bookId as number).subscribe((response) => {});
                }

                return new Observable<VolProgress>();
            })
        );


        return data;
    }

    CreateVolumeProgress(volumeId: number, accountId: number, bookId: number) {
        let body = JSON.stringify({
            volId: volumeId,
            accountId: accountId,
            bookId: bookId
        })

        let headers = { 'content-type': 'application/json' }

        let data = this.http.post<Volume>(`${this.apiUrl}CreateVolProgress`, body, { 'headers': headers });
        if (!data) return new Observable((observer) => { observer.next(null) });
        return data;
    }

    VerifyVolumeProgress(volumeId: number, accountId: number, bookId: number) {
        this.GetVolumeProgress(volumeId, accountId, bookId).subscribe((response: VolProgress) => {})
      }


    UpdatePagesRead(progress: VolProgress) {
        let body = JSON.stringify({
            bookId: progress.bookId,
            pagesRead: progress.pagesRead,
            volId: progress.volId,
            accountId: progress.accountId
        })

        console.log({body})

        let headers = { 'content-type': 'application/json' }

        let data = this.http.post(`${this.apiUrl}UpdPagesRead`, body, { 'headers': headers });
        return data;
    }

    UpdateTotalPages(progress: VolProgress, totalPages: number) {
        let body = JSON.stringify({
            bookId: progress.bookId,
            totalPages: totalPages,
            volId: progress.volId,
        })

        let headers = { 'content-type': 'application/json' }

        let data = this.http.put(`${this.apiUrl}UpdTotalPages?bookId=${progress.bookId}&totalPages=${totalPages}&volId=${progress.volId}`, {});
        return data;

    }
}
