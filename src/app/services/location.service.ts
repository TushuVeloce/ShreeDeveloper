import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
    providedIn: 'root',
})
export class LocationService {
    constructor() { }

    // Haversine formula to calculate distance between two geo-coordinates
    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in meters
    }

    // Function to check if user is near the office
    async checkUserLocation(officeLocation: { latitude: number; longitude: number; radius: number }) {
        try {
            // Request location permission
            const permission = await Geolocation.requestPermissions();
            if (permission.location !== 'granted') {
                throw new Error('Location permission not granted.');
            }

            // Get user's current location
            const coordinates = await Geolocation.getCurrentPosition();
            const userLat = coordinates.coords.latitude;
            const userLon = coordinates.coords.longitude;


            // Calculate distance to office
            const distance = this.calculateDistance(
                userLat,
                userLon,
                officeLocation.latitude,
                officeLocation.longitude
            );


            // Return structured data
            return {
                userLocation: { latitude: userLat, longitude: userLon },
                officeLocation: officeLocation,
                distance: parseFloat(distance.toFixed(2)), // Convert to number
                isInside: distance <= officeLocation.radius,
            };
        } catch (error) {
            console.error('❌ Error getting location:', error);
            return { error:'Unable to fetch location.' };
        }
    }
}
