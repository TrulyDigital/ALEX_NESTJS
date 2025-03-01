import { Injectable } from '@nestjs/common';
import { pcml_cltrespr01 } from './integration-test/pcml-as400/pcml-cltrespr01.integration';

@Injectable()
export class AppService {

  async onModuleInit(): Promise<void> {
    this.execute();
  }

  async execute(): Promise<void> {
    await pcml_cltrespr01();
  }

}
