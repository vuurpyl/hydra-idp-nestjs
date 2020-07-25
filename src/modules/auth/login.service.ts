import { Injectable } from '@nestjs/common';
import { HydraService } from '../hydra/hydra.service';

@Injectable()
export class LoginService {
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
}
