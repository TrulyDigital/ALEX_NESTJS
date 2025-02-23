export enum ErrorCodes {
  // backend #1 - bscs
  ERR_001 = 'ERR_001',
  // interface #1 - register resources
  ERR_100 = 'ERR_100',
  // unknown
  ERR_111 = 'ERR_111',
}

export enum ErrorMessages { 
  // backend #1 - bscs
  MSG_001_1 = 'Technical error from oracle database',
  MSG_001_2 = 'Timeout while connecting to the oracle database',
  MSG_001_3 = 'Validation error in the response from oracle database',
  // interface #1 - register resources
  MSG_100_1 = 'Validation error in the request',
  MSG_100_2 = 'URL not found',
  // unknown
  MSG_111 = 'Unknown error',
}