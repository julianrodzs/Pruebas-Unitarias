import request from 'supertest';
import express from 'express';
import router from './routes/userRoutes.js'; // Cambia a import y agrega la extensión .js
import { user } from './models/userModel.js'; // Asegúrate de incluir la extensión .js
import student from './models/studentModel.js'; // Asegúrate de incluir la extensión .js


const app = express();
app.use(express.json());
app.use('/', router);

// simular los modelos de usuario y estudiante
jest.mock('./models/userModel.js', () => ({
    user: {
      findOne: jest.fn(), // Asegúrate de usar el mismo nombre del modelo exportado
    },
  }));

jest.mock('./models/studentModel', () => ({
  findOne: jest.fn(),
}));

jest.mock('./models/activityModel', () => ({
    findOne: jest.fn(),
    create: jest.fn(),
  }))

describe('POST /login', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    // caso de prueba numero 1, inicio de sesion existoso con nombre de usuario
    test('Inicio de sesión exitoso para un usuario(profesor o asistente administrativo) existente en user con credenciales correctas', async () => {
      // Datos simulados
      const mockUser = {
        username: 'jaimecab2002@gmail.com',
        password: '27272727',
     
      };
  
      user.findOne.mockResolvedValue(mockUser);
      console.log(user.findOne.mock)
      // Realizar la solicitud
      const response = await request(app)
        .post('/login')
        .send({ username: 'jaimecab2002@gmail.com', password: '27272727' });
  
      // Verificar la respuesta
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        status: true,
        message: 'Usuario logeado',
        user: mockUser,
      });
  
      // Verificar que se llamó a user.findOne con los parámetros correctos
      expect(user.findOne).toHaveBeenCalledWith({ username: 'jaimecab2002@gmail.com' });
    });
  // caso prueba 2, inicio de sesion incorrecto con nombre de usuario
  test('Fallo de inicio de sesión para un usuario en user(profesor o asistente administrativo) con contraseña incorrecta', async () => {
    const mockUser = {
      username: 'jaimecab2002@gmail.com',
      password: '27272727',
    };

    user.findOne.mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/login')
      .send({ username: 'jaimecab2002@gmail.com', password: 'contraseñaIncorrecta' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: false,
      message: 'Contraseña Incorrecta',
    });

    expect(user.findOne).toHaveBeenCalledWith({ username: 'jaimecab2002@gmail.com' });
  });
  // caso 5, campos faltantes 
   test('Fallo de inicio de sesión con username faltante', async () => {
    const response = await request(app)
      .post('/login')
      .send({ password: 'contraseña' });

    // Asumiendo que el servidor responde con un código 400 y un mensaje de error
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      message: 'El campo username es requerido',
    });
  });

  test('Fallo de inicio de sesión con password faltante', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'nat@estudiantec.cr' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      message: 'El campo password es requerido',
    });
  });
});
