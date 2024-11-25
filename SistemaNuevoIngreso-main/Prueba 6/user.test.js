import request from 'supertest';
import app from '../../index'; // Ajusta esto según tu configuración de servidor Express

describe('userRoutes API Tests', () => {
  test('POST / - debería crear un nuevo usuario', async () => {
    const newUser = {
      username: 'testuser',
      password: '1234',
      name: 'Test',
      secondName: 'User',
      lastName: 'Last',
      secondLastName: 'Name',
      officePhone: '12345678',
      phoneNumber: '87654321',
      campus: 'Cartago',
      isAdministrative: false,
      teacherID: '12345',
      profilePic: ''
    };
    const res = await request(app).post('/').send(newUser);
    expect(res.statusCode).toBe(201);
  });

  test('POST /RestorePassword - debería enviar un correo para restaurar contraseña', async () => {
    const res = await request(app).post('/RestorePassword').send({ email: 'test@example.com' });
    expect(res.statusCode).toBe(200);
  });

  test('POST /ChangePass/:id - debería cambiar contraseña del estudiante', async () => {
    const studentId = '12345'; // Cambiar por un ID real en la BD
    const res = await request(app).post(`/ChangePass/${studentId}`).send({
      contrasenaActual: '1234',
      contrasenaNueva: '5678'
    });
    expect(res.statusCode).toBe(200);
  });
});