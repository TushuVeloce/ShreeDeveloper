import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationMobileAppService {
  constructor(private http: HttpClient) { }

  async getCurrentCoordinates(): Promise<{ lat: number; lng: number }> {
    const position = await Geolocation.getCurrentPosition();
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
  }

  async getReadableLocation(lat: number, lng: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    try {
      const response: any = await this.http.get(url).toPromise();
      return response.display_name || 'Unknown location';
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return 'Unable to get location';
    }
  }

  async getFullLocation(): Promise<{ lat: number; lng: number; address: string }> {
    const coords = await this.getCurrentCoordinates();
    const address = await this.getReadableLocation(coords.lat, coords.lng);
    return {
      ...coords,
      address
    };
  }
}
