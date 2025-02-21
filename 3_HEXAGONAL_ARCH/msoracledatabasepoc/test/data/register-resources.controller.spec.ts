/**
 * 
 * 
 */

// http 200 defualt
const request_1 = {
	"iccid": " 89571018020080284633",
	"provider_id": " PA00003201",
	"enterprise_id": "GMCLAROCO",
	"eid": "89033023311330000000025620184895",
	"imei": "",
	"plan_id": "AH001",
	"location": ""
};

// http 500
const request_2 = {
	"iccid": "001",
	"provider_id": " PA00003201",
	"enterprise_id": "GMCLAROCO",
	"eid": "89033023311330000000025620184895",
	"imei": "",
	"plan_id": "AH001",
	"location": ""
};

// http 502
const request_3 = {
	"iccid": "003",
	"provider_id": " PA00003201",
	"enterprise_id": "GMCLAROCO",
	"eid": "89033023311330000000025620184895",
	"imei": "",
	"plan_id": "AH001",
	"location": ""
};

// http 504
const request_4 = {
	"iccid": "002",
	"provider_id": " PA00003201",
	"enterprise_id": "GMCLAROCO",
	"eid": "89033023311330000000025620184895",
	"imei": "",
	"plan_id": "AH001",
	"location": ""
};

export const register_resources_controller_mock_data = {
  //
  request_1,
	request_2,
	request_3,
	request_4,
}