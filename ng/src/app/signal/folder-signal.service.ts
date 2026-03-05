import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';

const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })

export class FolderSignalService {
  folderList = signal<any[]>([]);
  folderID = signal<number | null>(null);

  private http = inject(HttpClient);

  constructor() {
    this.loadFolders();
  }

  loadFolders(): void {
    this.http.get<any[]>(`${API_URL}/folders`, { withCredentials: true }).subscribe({
      next: (folders) => this.folderList.set(folders),
      error: () => this.folderList.set([]),
    });
  }
}
