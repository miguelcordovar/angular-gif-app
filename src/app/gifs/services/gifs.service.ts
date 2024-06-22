import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _tagsHistory: string[] = [];
  private apiKey: string = 'YEj6SLmIZq5mZKSy0S072pVKRpwoWQRp';
  private baseUrl: string = 'https://api.giphy.com/v1/gifs';
  public gifList: Gif[] = [];

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory(): string[] {
    return [...this._tagsHistory];
  }

  private organizeTagsHistory(tag: string): void {
    tag = tag.trim().toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter(t => t !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.slice(0, 10);

    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    const history = localStorage.getItem('history');

    if (history) {
      this._tagsHistory = JSON.parse(history);
      this.searchTag(this._tagsHistory[0]);
    }
  }

  public searchTag(tag: string): void {

    if (tag.trim().length === 0) { return; }

    this.organizeTagsHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', tag)
      .set('limit', '10');

    this.http.get<SearchResponse>(`${this.baseUrl}/search`, { params })
      .subscribe((response) => {
        this.gifList = response.data;
      });

  }

}
