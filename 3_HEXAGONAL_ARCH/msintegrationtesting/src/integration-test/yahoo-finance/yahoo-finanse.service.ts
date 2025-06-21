import yahooFinance from 'yahoo-finance2';
import { Parser } from 'json2csv';
import * as fs from 'fs';

export async function getHistorical(
  name: string,
  period1: string,
  period2: string,
  interval: any,
) {

  try{
    const result = await yahooFinance.historical(name, {
      period1: period1,
      period2: period2,
      interval: interval
    });

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // "YYYY-MM-DD"

    // Campos que quieres incluir en el CSV
    const fields = ['date', 'open', 'high', 'low', 'close', 'volume', 'adjClose'];

    // Convertir JSON a CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(result);

    // Guardar CSV en archivo
    fs.writeFileSync('ferrari_historico.csv', csv);

    console.log('Archivo CSV guardado como ferrari_historico.csv');
  }
  catch(err){
    console.log(err);
  }

  
  
}