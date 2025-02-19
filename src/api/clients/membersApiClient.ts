import { BaseApiClient } from './baseApiClient';
import { API_ENDPOINTS } from '../config';
import type { Member } from '../types';

export class MembersApiClient extends BaseApiClient {
  async getMembers(): Promise<Member[]> {
    return this.get<Member[]>(API_ENDPOINTS.members);
  }

  async getMember(id: string): Promise<Member> {
    return this.get<Member>(`${API_ENDPOINTS.members}/${id}`);
  }
}