const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Your index.js file for API
const Log = require('../models/Log'); // Import the Log model
const Task = require('../models/Task'); // Import the Task model

let token; // Will store the JWT token for authenticated requests
let createdTaskId; // Will store a task ID for testing

// Set up test suite
describe('API Routes', () => {
  // Connect to the test database before running tests
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a test user and login to get a token
    await request(app)
      .post('/api/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        phoneNumber: '1234567890',
        password: 'password123',
        statusType: 'volunteer',
      });

    const loginResponse = await request(app)
      .post('/api/login')
      .send({ email: 'testuser@example.com', password: 'password123' });

    token = loginResponse.body.token;
  });

  // Clean up after all tests
  afterAll(async () => {
    // Clear the database and close the connection
    await mongoose.connection.db.dropDatabase(); // Clear test database
    await mongoose.connection.close(); // Close the connection
  });

  // Test for the /api/user route
  it('GET /api/user - Should fetch current user details', async () => {
    const response = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('firstName', 'Test');
    expect(response.body).toHaveProperty('lastName', 'User');
  });

  // Test for creating a task
  it('POST /api/tasks - Should create a new task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        duration: '01/01/2023 - 01/31/2023',
        document: 'test-document.pdf',
        color: 'blue',
        status: 'None',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('title', 'Test Task');

    createdTaskId = response.body._id; // Save the task ID for later use
  });

  // Test for fetching all tasks
  it('GET /api/tasks - Should fetch all tasks', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test for fetching tasks for the current volunteer
  it('GET /api/volunteer-tasks - Should fetch tasks assigned to the current volunteer', async () => {
    const response = await request(app)
      .get('/api/volunteer-tasks')
      .set('Authorization', `Bearer ${token}`);

    if (response.status === 404) {
      expect(response.body.message).toBe('No tasks assigned to you.');
    } else {
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    }
  });

  // Test for updating a task and checking if logs are created
  it('PUT /api/tasks/:id - Should update an existing task and create logs', async () => {
    const response = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'In Progress' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'In Progress');

    // Check if the update log was created
    const updateLog = await Log.findOne({ action: /Task Updated by/ });
    expect(updateLog).toBeTruthy();
    expect(updateLog.taskTitle).toBe('Test Task');
    expect(updateLog.action).toContain('Task Updated by Test User');
  });

  // Test for deleting a task and checking if logs are created
  it('DELETE /api/tasks/:id - Should delete a task and create logs', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);

    // Check if the delete log was created
    const deleteLog = await Log.findOne({ action: /Task Deleted by/ });
    expect(deleteLog).toBeTruthy();
    expect(deleteLog.taskTitle).toBe('Test Task');
    expect(deleteLog.action).toContain('Task Deleted by Test User');
  });

  // Login API Tests
  describe('Login API', () => {
    // Test successful login
    it('POST /api/login - Should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ email: 'testuser@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('statusType', 'volunteer');
    });

    // Test login with invalid email
    it('POST /api/login - Should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ email: 'wrong@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid email or password.');
    });

    // Test login with invalid password
    it('POST /api/login - Should fail with invalid password', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ email: 'testuser@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid email or password.');
    });

    // Test login with missing fields
    it('POST /api/login - Should fail with missing fields', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ email: 'testuser@example.com' }); // Missing password

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email and password are required.');
    });
  });

  // Register API Tests
  describe('Register API', () => {
    // Test successful registration
    it('POST /api/register - Should register a new user', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          firstName: 'New',
          lastName: 'User',
          email: 'newuser@example.com',
          phoneNumber: '1234567890',
          password: 'password123',
          statusType: 'volunteer',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully!');
    });

    // Test registration with an existing email
    it('POST /api/register - Should fail with existing email', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'testuser@example.com', // Already exists
          phoneNumber: '1234567890',
          password: 'password123',
          statusType: 'volunteer',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'User already exists or registration failed.');
    });

    // Test registration with missing fields
    it('POST /api/register - Should fail with missing fields', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          firstName: 'New',
          lastName: 'User',
          // Missing email, phoneNumber, password, statusType
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    // Test unauthorized admin registration
    it('POST /api/register - Should fail for unauthorized admin registration', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          firstName: 'Unauthorized',
          lastName: 'Admin',
          email: 'unauthorized@example.com',
          phoneNumber: '1234567890',
          password: 'password123',
          statusType: 'admin', // Not in allowedAdminNames
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'You are not authorized to register as an admin.');
    });

    // Test authorized admin registration
    it('POST /api/register - Should succeed for authorized admin registration', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          firstName: 'Naomi',
          lastName: 'Dion-Gokan', // In allowedAdminNames
          email: 'naomi@example.com',
          phoneNumber: '1234567890',
          password: 'password123',
          statusType: 'admin',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully!');
    });
  });

  // Test for clearing all assignees from a task
  it('POST /api/tasks/:taskId/clear - Should clear all assignees from a task', async () => {
    // Create a new task and assign a volunteer
    const taskResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Task to Clear',
        duration: '01/01/2023 - 01/31/2023',
        document: 'test-document.pdf',
        color: 'blue',
        status: 'None',
      });

    const volunteerResponse = await request(app)
      .post('/api/register')
      .send({
        firstName: 'Volunteer',
        lastName: 'User',
        email: 'volunteer2@example.com',
        phoneNumber: '1234567890',
        password: 'password123',
        statusType: 'volunteer',
      });

    const taskId = taskResponse.body._id;
    const volunteerId = volunteerResponse.body._id;

    await request(app)
      .post('/api/tasks/assign')
      .set('Authorization', `Bearer ${token}`)
      .send({ volunteerId, taskId });

    // Clear all assignees from the task
    const clearResponse = await request(app)
      .post(`/api/tasks/${taskId}/clear`)
      .set('Authorization', `Bearer ${token}`);

    expect(clearResponse.status).toBe(200);
    expect(clearResponse.body).toHaveProperty('message', 'All assignees cleared successfully.');

    // Verify that the task has no assignees
    const updatedTask = await Task.findById(taskId);
    expect(updatedTask.assignedVolunteers).toHaveLength(0);
  });

  // Test for removing a volunteer from a task
  it('POST /api/tasks/remove - Should remove a volunteer from a task', async () => {
    // Create a new task and assign a volunteer
    const taskResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Task to Remove',
        duration: '01/01/2023 - 01/31/2023',
        document: 'test-document.pdf',
        color: 'blue',
        status: 'None',
      });

    const volunteerResponse = await request(app)
      .post('/api/register')
      .send({
        firstName: 'Volunteer',
        lastName: 'User',
        email: 'volunteer3@example.com',
        phoneNumber: '1234567890',
        password: 'password123',
        statusType: 'volunteer',
      });

    const taskId = taskResponse.body._id;
    const volunteerId = volunteerResponse.body._id;

    await request(app)
      .post('/api/tasks/assign')
      .set('Authorization', `Bearer ${token}`)
      .send({ volunteerId, taskId });

    // Remove the volunteer from the task
    const removeResponse = await request(app)
      .post('/api/tasks/remove')
      .set('Authorization', `Bearer ${token}`)
      .send({ volunteerId, taskId });

    expect(removeResponse.status).toBe(200);
    expect(removeResponse.body).toHaveProperty('message', 'Volunteer removed from task successfully.');

    // Verify that the task no longer has the volunteer assigned
    const updatedTask = await Task.findById(taskId);
    expect(updatedTask.assignedVolunteers).not.toContain(volunteerId);
  });
});