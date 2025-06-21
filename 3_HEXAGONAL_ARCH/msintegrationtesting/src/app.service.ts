import { Injectable } from '@nestjs/common';
import { pcml_cltrespr01 } from './integration-test/pcml-as400/pcml-cltrespr01.integration';
import { pcml_cltrespr01_1 } from './integration-test/pcml-as400/pcml-cltrespr01.integration-1';
import { pcml_cltrespr01_2 } from './integration-test/pcml-as400/pcml-cltrespr01.integration-2';
import { getHistorical } from './integration-test/yahoo-finance/yahoo-finanse.service';

@Injectable()
export class AppService {

  async onModuleInit(): Promise<void> {
    this.execute();
  }

  async execute(): Promise<void> {
    //await pcml_cltrespr01();
    await pcml_cltrespr01_1();
    //await pcml_cltrespr01_2();
    //await pcml_cltrespr01_1();
    //await pcml_cltrespr01_2();

    await getHistorical(
      'RACE',
      '2019-05-15',
      '2025-05-15',
      '1d'
    );
  }

}
