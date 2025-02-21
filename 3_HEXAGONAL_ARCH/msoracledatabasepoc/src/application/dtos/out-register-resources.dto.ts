class DataDto{
  output_code: string | null;
  output_description: string | null;
  mobile_number: string | null;
}

export class OutRegisterResourcesDto{
  status_code: number;
  message: string;
  transaction_id: string;
  data: DataDto;
}