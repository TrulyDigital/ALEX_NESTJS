import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { get_app_base_path, get_app_operation_find_properties, get_app_port, get_app_swagger_path, routes } from '../src/interfaces/routes/routes';
import { register_resources_controller_mock_data } from './data/register-resources.controller.spec';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  /**
   * 
   * @description
   * 
   * Success
   * 
   */

  it('/FIND/Proerties - 200 - POST', () => {
    return request(app.getHttpServer())
      .post(`${routes.APPLICATION_BASE_PATH}${routes.APPLICATION_OPERATION_QUERY_PROPERTIES}`)
      .send(register_resources_controller_mock_data.request_1)
      .expect(200)
  });

  /**
   * 
   * @descriontion
   * 
   * Error
   * 
   */

  it('/FIND/Proerties - 500 - POST', () => {
    return request(app.getHttpServer())
      .post(`${routes.APPLICATION_BASE_PATH}${routes.APPLICATION_OPERATION_QUERY_PROPERTIES}`)
      .send(register_resources_controller_mock_data.request_2)
      .expect(500)
  });

  it('/FIND/Proerties - 502 - POST', () => {
    return request(app.getHttpServer())
      .post(`${routes.APPLICATION_BASE_PATH}${routes.APPLICATION_OPERATION_QUERY_PROPERTIES}`)
      .send(register_resources_controller_mock_data.request_3)
      .expect(502)
  });

  it('/FIND/Proerties - 504 - POST', () => {
    return request(app.getHttpServer())
      .post(`${routes.APPLICATION_BASE_PATH}${routes.APPLICATION_OPERATION_QUERY_PROPERTIES}`)
      .send(register_resources_controller_mock_data.request_4)
      .expect(504)
  });

  /**
   * 
   * @description
   * 
   * Routes
   * 
   */

  it('Routes - Base Path', () => {
    expect(get_app_base_path(undefined)).toBe(routes.APPLICATION_BASE_PATH);
  });

  it('Routes - Port', () => {
    expect(get_app_port(undefined)).toBe(routes.APPLICATION_PORT);
  });

  it('Routes - Swagger Path', () => {
    expect(get_app_swagger_path(undefined)).toBe(routes.APPLICATION_SWAGGER_PATH);
  });

  it('Routes - Operation OrderKO', () => {
    expect(get_app_operation_find_properties(undefined)).toBe(routes.APPLICATION_OPERATION_QUERY_PROPERTIES);
  });

  /**
   * 
   * @description
   * 
   * Finish Unit Test
   * 
   */

  afterAll(async () => {
    await app.close();
  });

});
