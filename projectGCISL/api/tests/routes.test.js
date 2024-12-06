// const request = require('supertest');
// const mongoose = require('mongoose');
// const app = require('../index'); // Your index.js file for API

// let token; // Will store the JWT token for authenticated requests
// let createdTaskId; // Will store a task ID for testing

// // Set up test suite
// describe('API Routes', () => {
//   // Set up the database connection before running tests
//   beforeAll(async () => {
//     // Connect to the test database
//     await mongoose.connect(process.env.TEST_MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     // Create a test user and login to get a token
//     await request(app)
//       .post('/api/register')
//       .send({
//         firstName: 'Test',
//         lastName: 'User',
//         email: 'testuser@example.com',
//         phoneNumber: '1234567890',
//         password: 'password123',
//         statusType: 'volunteer',
//       });

//     const loginResponse = await request(app)
//       .post('/api/login')
//       .send({ email: 'testuser@example.com', password: 'password123' });

//     token = loginResponse.body.token;
//   });

//   // Test for the /api/user route
//   it('GET /api/user - Should fetch current user details', async () => {
//     const response = await request(app)
//       .get('/api/user')
//       .set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('firstName', 'Test');
//     expect(response.body).toHaveProperty('lastName', 'User');
//   });

//   // Test for creating a task
//   it('POST /api/tasks - Should create a new task', async () => {
//     const response = await request(app)
//       .post('/api/tasks')
//       .set('Authorization', `Bearer ${token}`)
//       .send({
//         title: 'Test Task',
//         duration: '01/01/2023 - 01/31/2023',
//         document: 'test-document.pdf',
//         color: 'blue',
//         status: 'None',
//       });

//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty('_id');
//     expect(response.body).toHaveProperty('title', 'Test Task');

//     createdTaskId = response.body._id; // Save the task ID for later use
//   });

//   // Test for fetching all tasks
//   it('GET /api/tasks - Should fetch all tasks', async () => {
//     const response = await request(app)
//       .get('/api/tasks')
//       .set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//     expect(response.body.length).toBeGreaterThan(0);
//   });

//   // Test for fetching tasks for the current volunteer
//   it('GET /api/volunteer-tasks - Should fetch tasks assigned to the current volunteer', async () => {
//     const response = await request(app)
//       .get('/api/volunteer-tasks')
//       .set('Authorization', `Bearer ${token}`);

//     if (response.status === 404) {
//       expect(response.body.message).toBe('No tasks assigned to you.');
//     } else {
//       expect(response.status).toBe(200);
//       expect(Array.isArray(response.body)).toBe(true);
//     }
//   });

//   // Test for updating a task
//   it('PUT /api/tasks/:id - Should update an existing task', async () => {
//     const response = await request(app)
//       .put(`/api/tasks/${createdTaskId}`)
//       .set('Authorization', `Bearer ${token}`)
//       .send({ status: 'In progress' });

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('status', 'In progress');
//   });

//   // Test for deleting a task
//   it('DELETE /api/tasks/:id - Should delete a task', async () => {
//     const response = await request(app)
//       .delete(`/api/tasks/${createdTaskId}`)
//       .set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(204);
//   });

//   // Clean up after all tests
//   afterAll(async () => {
//     // Delete the test user
//     const userResponse = await request(app)
//       .get('/api/user')
//       .set('Authorization', `Bearer ${token}`);

//     if (userResponse.body && userResponse.body._id) {
//       //await mongoose.connection.collection('users').deleteOne({ _id: mongoose.Types.ObjectId(userResponse.body._id) });
//       await mongoose.connection.collection('users').deleteOne({ _id: new mongoose.Types.ObjectId(userResponse.body._id) });
//     }

//     // Drop all collections to ensure a clean slate
//     await mongoose.connection.db.dropDatabase();

//     // Close database connection
//     await mongoose.disconnect();
//   });
// });


const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Your index.js file for API

let token; // Will store the JWT token for authenticated requests
let createdTaskId; // Will store a task ID for testing

// Set up test suite
describe('API Routes', () => {
  // Connect to the test database before running tests
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGODB_URI, {
      useNewUrlParser: true, // These are fine even if deprecated
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

  // Test for updating a task
  it('PUT /api/tasks/:id - Should update an existing task', async () => {
    const response = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'In progress' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'In progress');
  });

  // Test for deleting a task
  it('DELETE /api/tasks/:id - Should delete a task', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});