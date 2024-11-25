import request from 'supertest';
import app from '../../index';

describe('AsistenteAdministrativoRoutes API Tests', () => {
  test('GET /AsistenteAdministrativo/ListaEstudiantes/:campus - debería retornar lista de estudiantes', async () => {
    const res = await request(app).get('/AsistenteAdministrativo/ListaEstudiantes/Cartago');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /AsistenteAdministrativo/subirArchivo - debería agregar estudiantes al sistema', async () => {
    const mockData = [
      { Carne: '12345', Nombre: 'Juan', SegundoNombre: 'Carlos', Apellido: 'Pérez', SegundoApellido: 'López', Correo: 'juan@test.com', Telefono: '88888888', Campus: 'Cartago' }
    ];
    const res = await request(app).post('/AsistenteAdministrativo/subirArchivo').send({ data: mockData });
    expect(res.statusCode).toBe(200);
  });

  test('GET /AsistenteAdministrativo/VerDetallesEstudiante/:id - debería obtener detalles del estudiante', async () => {
    const studentId = '12345'; // Cambiar por un ID real en la BD
    const res = await request(app).get(`/AsistenteAdministrativo/VerDetallesEstudiante/${studentId}`);
    expect(res.statusCode).toBe(200);
  });

});