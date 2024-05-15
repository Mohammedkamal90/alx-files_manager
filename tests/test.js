import request from 'supertest';
import { app } from '../server';

describe('GET /status', () => {
  it('should respond with status 200 and a JSON object containing the status of Redis and MongoDB', async () => {
    const response = await request(app).get('/status');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ redis: true, db: true });
  });
});

describe('GET /stats', () => {
  it('should respond with status 200 and a JSON object containing the number of users and files in the database', async () => {
    const response = await request(app).get('/stats');
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('users');
    expect(response.body).toHaveProperty('files');
  });
});

// Additional tests for other endpoints can be added similarly
