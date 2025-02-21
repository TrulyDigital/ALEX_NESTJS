export class RegisterResourcesInEntity{

  private iccid: string;
  private provider_id: string;
  private enterprise_id: string;
  private eid: string;
  private imei: string;
  private plan_id: string;
  private location: string;
  

  constructor(
    iccid: string,
    provider_id: string,
    enterprise_id: string,
    eid: string,
    imei: string,
    plan_id: string,
    location: string,
  ){
    this.iccid = iccid;
    this.provider_id = provider_id;
    this.enterprise_id = enterprise_id;
    this.eid = eid;
    this.imei = imei;
    this.plan_id = plan_id;
    this.location = location;
  }

  /**
   * 
   * getters 
   * 
   */

  get_iccid(): string{
    return this.iccid;
  }

  get_provider_id(): string{
    return this.provider_id;
  }

  get_enterprise_id(): string{
    return this.enterprise_id;
  }

  get_eid(): string{
    return this.eid;
  }

  get_imei(): string{
    return this.imei;
  }

  get_plan_id(): string{
    return this.plan_id;
  }

  get_location(): string{
    return this.location;
  }
}