import request from 'supertest';
import app from '../../index'; // Ajusta esto según tu configuración de servidor Express

describe('ProfesorGuiaCoordinadorRoutes API Tests', () => {
  test('POST /CrearActividad - debería crear una nueva actividad', async () => {
    const newActivity = {
      nombre: 'Actividad Test',
      estado: 'Pendiente',
      semana: 1,
      tipo: 'Taller',
      afiche: '',
      fechaPublicacion: '2024-11-30',
      fecha: '2024-12-15',
      hora: '10:00 AM',
      modalidad: 'Virtual',
      enlaceReunion: 'http://example.com/',
      responsables: ['12345'], // IDs de usuarios
      recordatorios: [],
      evidencias: [],
      comentarios: []
    };
    const res = await request(app).post('/CrearActividad').send(newActivity);
    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe('Actividad Test');
  });

  test('GET /ListaActividades - debería listar actividades', async () => {
    const res = await request(app).get('/ListaActividades');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /generarInformeCampus/:Campus - debería generar un informe Excel', async () => {
    const campus = 'Cartago';
    const res = await request(app).get(`/generarInformeCampus/${campus}`);
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });
});