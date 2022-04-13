import { Module, HttpModule } from '@nestjs/common';
import { HydraService } from './hydra.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: `http://127.0.0.1:4445`,
    }),
  ],
  providers: [HydraService],
  exports: [HydraService],
})
export class HydraModule {}
