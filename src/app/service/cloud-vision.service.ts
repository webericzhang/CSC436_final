import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { googleVision } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudVisionService {

  cloudVisionBaseUrl = 'https://vision.googleapis.com/v1/images:annotate?';
  cloudVisionParam = `key=${googleVision}`;

  constructor(private http: HttpClient) {

  }

  detectText(imageUri: string): Observable<any> {
    const request: any = {
      'requests': [
        {
          'image': {
            'source': {
              'imageUri': `${imageUri}`,
            },
          },
          'features': [
            {
              'type': 'TEXT_DETECTION',
              'maxResults': 1,
            }
          ]
        }
      ]
    };
    
    let url = `${this.cloudVisionBaseUrl}${this.cloudVisionParam}`;

    return this.http.post(url, request).pipe(
      map(response => response['responses'][0]['textAnnotations'])
    );

  }


}
