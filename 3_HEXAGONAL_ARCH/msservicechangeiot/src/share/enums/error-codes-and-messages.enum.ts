export enum ErrorHttpCodes {
  HTTP_400_CODE = 400,
  HTTP_404_CODE = 404,
  HTTP_500_CODE = 500,
  HTTP_502_CODE = 502,
  HTTP_503_CODE = 503,
  HTTP_504_CODE = 504,
}

export enum ErrorHttpDescriptions {
  HTTP_400_DESC = 'Bad Request',
  HTTP_404_DESC = 'Not Found',
  HTTP_500_DESC = 'Internal Server Error',
  HTTP_502_DESC = 'Bad Gateway',
  HTTP_503_DESC = 'Service Unavailable',
  HTTP_504_DESC = 'Gateway TImeout',
}

export enum ErrorHttpMessagesInfraestructure {
  // oracle
  HTTP_500_MSG_1 = 'Technical error from database',
  HTTP_502_MSG_1 = 'Invalid response from the database',
  HTTP_504_MSG_1 = 'Timeout error from database',
}

export enum ErrorHttpMessagesInterface {
  HTTP_400_MSG = 'Invalid input data, check the technical log for transaction_id',
  HTTP_404_MSG = 'Operation or URL could not be found',
  HTTP_500_MSG = 'Internal Server Error',
  HTTP_503_MSG = 'Circuit Breaker, service unavailable, please wait',
}