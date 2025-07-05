import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCaKbVhcX_22R_pRKDYuNA7vox-PtGaDkI';

export type Maps = typeof google.maps;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  public load(): Promise<Maps> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.reject('Not in browser context');
    }

    const callbackName = `GooglePlaces_cb_` + ((Math.random() * 1e9) >>> 0);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = this.getScriptSrc(callbackName);

    interface MyWindow { [key: string]: Function; }
    const myWindow: MyWindow = window as any;

    const promise = new Promise<Maps>((resolve, reject) => {
      myWindow[callbackName] = () => resolve(google.maps);
      script.onerror = reject;
    });

    document.body.appendChild(script);
    return promise;
  }

  private getScriptSrc(callback: string): string {
    const query = {
      v: '3',
      callback,
      key: GOOGLE_MAPS_API_KEY,
      libraries: 'places',
      language: 'fr'
    };

    const params = Object.entries(query).map(([key, val]) => `${key}=${val}`).join('&');
    return `https://maps.googleapis.com/maps/api/js?${params}`;
  }
}
