import { Injectable } from '@nestjs/common';
import { HydraService } from '../hydra/hydra.service';

@Injectable()
export class SigninService {
  constructor(private readonly hydraService: HydraService) {}

  async getLoginRequest(challenge: string) {
    return await this.hydraService.getLoginRequest(challenge);
  }

  async acceptLoginRequest(challenge: string, subject: string): Promise<string> {
    const { redirect_to } = await this.hydraService.acceptLoginRequest( challenge, { subject } );
    return redirect_to;
  }

  async acceptLoginRequestAndRemember(challenge: string, subject: string, remember: boolean): Promise<string> {
    const body = {
      subject,
      remember,
      remember_for: 3600,
    };
    const { redirect_to } = await this.hydraService.acceptLoginRequest( challenge, body );
    return redirect_to;
  }

  async rejectLoginRequest(challenge: string): Promise<string> {
    const body = {
      error: 'access_denied',
      errorDescription: 'The resource owner denied the request'
    };
    const { redirect_to } = await this.hydraService.rejectLoginRequest(challenge, body);
    return redirect_to;
  }
}
