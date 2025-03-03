const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');

let token;
let adminToken;
let taskId;
let volunteerId;

describe('Basic API Endpoint Tests', () => {
  // Connect to test database before running tests
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Register volunteer
    const volunteerResponse = await request(app)
      .post('/api/register')
      .send({
        firstName: 'Test',
        lastName: 'Volunteer',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        password: 'password123',
        statusType: 'volunteer',
      });
    
    volunteerId = volunteerResponse.body.userId || volunteerResponse.body._id;

    // Register admin
    await request(app)
      .post('/api/register')
      .send({
        firstName: 'Naomi',
        lastName: 'Dion-Gokan',
        email: 'admin@example.com',
        phoneNumber: '0987654321',
        password: 'password123',
        statusType: 'admin',
      });

    // Login as volunteer
    const loginResponse = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'password123' });
    
    token = loginResponse.body.token;

    // Login as admin
    const adminLoginResponse = await request(app)
      .post('/api/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    
    adminToken = adminLoginResponse.body.token;

    // Create a task
    const taskResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Task',
        duration: '01/01/2023 - 01/31/2023',
        document: 'test-document.pdf',
        color: 'blue',
        status: 'None',
      });

    taskId = taskResponse.body._id;
  });

  // Clean up after all tests
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  // Auth Endpoints
  describe('Auth Endpoints', () => {
    it('login endpoint responds', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('register endpoint responds', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          firstName: 'Another',
          lastName: 'User',
          email: 'another@example.com',
          phoneNumber: '5555555555',
          password: 'password123',
          statusType: 'volunteer',
        });

      expect([201, 400]).toContain(response.status); // 201 if created, 400 if already exists
    });
  });

  // User Endpoints
  describe('User Endpoints', () => {
    it('user endpoint responds', async () => {
      const response = await request(app)
        .get('/api/user')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('firstName');
    });

    it('users endpoint responds', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // Task Endpoints
  describe('Task Endpoints', () => {
    it('tasks endpoint responds', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('task by id endpoint responds', async () => {
      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);
    
      expect(response.status).toBe(200);
      // Check if response is an array and extract first item if needed
      const task = Array.isArray(response.body) ? response.body[0] : response.body;
      expect(task).toHaveProperty('_id');
    });

    it('task assign endpoint responds', async () => {
      const response = await request(app)
        .post('/api/tasks/assign')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          volunteerId,
          taskId,
        });

      expect([200, 400]).toContain(response.status); // 200 if assigned, 400 if already assigned
    });

    it('task remove endpoint responds', async () => {
      const response = await request(app)
        .post('/api/tasks/remove')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          volunteerId,
          taskId,
        });

      expect([200, 400]).toContain(response.status); // 200 if removed, 400 if not assigned
    });


    //----------------------------------------doesnt work--------------------------------------------------------//
    it('task clear endpoint responds', async () => {
      const response = await request(app)
        .post(`/api/tasks/${taskId}/clear`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });
  });

  // Volunteer-specific Endpoints
  describe('Volunteer Endpoints', () => {
    it('volunteer-tasks endpoint responds', async () => {
      const response = await request(app)
        .get('/api/volunteer-tasks')
        .set('Authorization', `Bearer ${token}`);

      expect([200, 404]).toContain(response.status); // 200 if tasks found, 404 if no tasks
    });

    it('volunteer-task-count endpoint responds', async () => {
      const response = await request(app)
        .get('/api/volunteer-task-count')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count');
    });
  });

  // Logs Endpoint
  describe('Logs Endpoint', () => {
    it('logs endpoint responds', async () => {
      const response = await request(app)
        .get('/api/logs')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});