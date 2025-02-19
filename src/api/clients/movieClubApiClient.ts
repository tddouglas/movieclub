import { BaseApiClient } from './baseApiClient';
import { API_ENDPOINTS } from '../config';
import type { MovieClub, Attendance } from '../types';

export class MovieClubApiClient extends BaseApiClient {
  async getMovieClubs(): Promise<MovieClub[]> {
    return this.get<MovieClub[]>(API_ENDPOINTS.movieClubs);
  }

  async getAttendance(timeframe: 'season' | 'all-time'): Promise<Attendance[]> {
    return this.get<Attendance[]>(`${API_ENDPOINTS.attendance}?timeframe=${timeframe}`);
  }
}