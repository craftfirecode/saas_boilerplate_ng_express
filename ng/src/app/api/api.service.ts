import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environment';
import { FolderSignalService } from '@signal/folder-signal.service';

const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class FolderService {
  private http = inject(HttpClient);
  private folderSignal = inject(FolderSignalService);

  async createFolder(data: any) {
    await lastValueFrom(this.http.post(`${API_URL}/folders`, data, { withCredentials: true }));
    this.folderSignal.loadFolders();
  }

  async updateFolder(id: number, data: any) {
    await lastValueFrom(this.http.put(`${API_URL}/folders/${id}`, data, { withCredentials: true }));
    this.folderSignal.loadFolders();
  }

  async deleteFolder(id: number) {
    await lastValueFrom(this.http.delete(`${API_URL}/folders/${id}`, { withCredentials: true }));
    this.folderSignal.loadFolders();
  }

  setFolderID(id: number | null) {
    this.folderSignal.folderID.set(id);
  }
}
