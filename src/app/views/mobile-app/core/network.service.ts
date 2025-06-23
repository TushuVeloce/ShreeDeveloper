// src/app/services/network.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Network, ConnectionStatus } from '@capacitor/network';

export interface DetailedNetworkStatus extends ConnectionStatus {
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private networkDetails = new BehaviorSubject<DetailedNetworkStatus>({
    connected: true,
    connectionType: 'unknown',
    timestamp: Date.now()
  });

  // Separate observable for just connection state
  private isOnline = new BehaviorSubject<boolean>(true);

  constructor() {
    this.loadInitialStatus();
    this.listenForNetworkChanges();
  }

  // Get detailed info
  getNetworkDetails(): Observable<DetailedNetworkStatus> {
    return this.networkDetails.asObservable();
  }

  // Get only connected status
  getOnlineStatus(): Observable<boolean> {
    return this.isOnline.asObservable();
  }

  // Retry logic trigger (for component retry button)
  async retryConnectionCheck(): Promise<void> {
    const status = await Network.getStatus();
    this.networkDetails.next({ ...status, timestamp: Date.now() });
    this.isOnline.next(status.connected);
    console.log('[Retry] Network status rechecked:', status);
    alert('Network status rechecked' + status)
  }

  private async loadInitialStatus(): Promise<void> {
    const status = await Network.getStatus();
    this.networkDetails.next({ ...status, timestamp: Date.now() });
    this.isOnline.next(status.connected);
  }

  private listenForNetworkChanges(): void {
    Network.addListener('networkStatusChange', (status: ConnectionStatus) => {
      const detailedStatus: DetailedNetworkStatus = {
        ...status,
        timestamp: Date.now()
      };
      this.networkDetails.next(detailedStatus);
      this.isOnline.next(status.connected);
      console.log('Network Changed:', status);
    });
  }
}
