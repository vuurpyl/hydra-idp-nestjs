import { Injectable, HttpService, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class HydraService {

  constructor(private readonly httpService: HttpService) {}

  httpOptions = {
    headers: {
      'Content-Type': 'application/json',
      'X-Forwarded-Proto': 'https'
    }
  };

  public async getLoginRequest(challenge) {
    return await this.get('login', challenge);
  }

  public async acceptLoginRequest(challenge, body) {
    return await this.put('login', 'accept', challenge, body);
  }

  public async rejectLoginRequest(challenge, body) {
    return await this.put('login', 'reject', challenge, body);
  }

  public async getConsentRequest(challenge) {
    return await this.get('consent', challenge);
  }

  public async acceptConsentRequest(challenge, body) {
    return await this.put('consent', 'accept', challenge, body);
  }

  public async rejectConsentRequest(challenge, body) {
    return await this.put('consent', 'reject', challenge, body);
  }

  public async getLogoutRequest(challenge) {
    return await this.get('logout', challenge);
  }

  public async acceptLogoutRequest(challenge) {
    return await this.put('logout', 'accept', challenge, {});
  }

  public async rejectLogoutRequest(challenge) {
    return await this.put('logout', 'reject', challenge, {});
  }

  public async introspectToken(token) {
    try {
      const { data } = await this.httpService.post(`/oauth2/introspect`, token, this.httpOptions).toPromise();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async get(flow: string, challenge: string) {
    try {
      const url = `/oauth2/auth/requests/${flow}?${flow}_challenge=${challenge}`;
      const { data } = await this.httpService.get(url, this.httpOptions).toPromise();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async put(flow, action, challenge, body) {
    try {
      const url = `/oauth2/auth/requests/${flow}/${action}?${flow}_challenge=${challenge}`;
      const { data } = await this.httpService.put(url, body, this.httpOptions).toPromise();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
