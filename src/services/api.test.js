import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('axios', () => {
  globalThis.__apiCaptured = {
    requestSuccess:  null,
    requestError:    null,
    responseSuccess: null,
    responseError:   null,
  };

  const mockInstance = {
    interceptors: {
      request: {
        use: vi.fn((onSuccess, onError) => {
          globalThis.__apiCaptured.requestSuccess = onSuccess;
          globalThis.__apiCaptured.requestError   = onError;
        }),
      },
      response: {
        use: vi.fn((onSuccess, onError) => {
          globalThis.__apiCaptured.responseSuccess = onSuccess;
          globalThis.__apiCaptured.responseError   = onError;
        }),
      },
    },
  };

  return {
    default: { create: vi.fn(() => mockInstance) },
  };
});

import axios from 'axios';
import api from './api';

describe('api.js — configuración de axios', () => {
  it('crea la instancia con Content-Type application/json', () => {
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('registra interceptor de request', () => {
    const instance = axios.create();
    expect(instance.interceptors.request.use).toHaveBeenCalled();
  });

  it('registra interceptor de response', () => {
    const instance = axios.create();
    expect(instance.interceptors.response.use).toHaveBeenCalled();
  });
});

describe('api.js — interceptor de request', () => {
  beforeEach(() => localStorage.clear());

  it('agrega Authorization cuando hay token en localStorage', () => {
    const fn = globalThis.__apiCaptured?.requestSuccess;
    if (!fn) return;
    localStorage.setItem('token', 'mi-token-jwt');
    const result = fn({ headers: {} });
    expect(result.headers.Authorization).toBe('Bearer mi-token-jwt');
  });

  it('NO agrega Authorization cuando no hay token', () => {
    const fn = globalThis.__apiCaptured?.requestSuccess;
    if (!fn) return;
    const result = fn({ headers: {} });
    expect(result.headers.Authorization).toBeUndefined();
  });

  it('rechaza el error de request correctamente', async () => {
    const fn = globalThis.__apiCaptured?.requestError;
    if (!fn) return;
    await expect(fn(new Error('fail'))).rejects.toThrow('fail');
  });
});

describe('api.js — interceptor de response', () => {
  it('despacha auth-error cuando la respuesta es 401', async () => {
    const fn = globalThis.__apiCaptured?.responseError;
    if (!fn) return;
    const spy = vi.spyOn(window, 'dispatchEvent');
    await fn({ response: { status: 401 } }).catch(() => {});
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ type: 'auth-error' }));
    spy.mockRestore();
  });

  it('NO despacha auth-error para errores distintos de 401', async () => {
    const fn = globalThis.__apiCaptured?.responseError;
    if (!fn) return;
    const spy = vi.spyOn(window, 'dispatchEvent');
    await fn({ response: { status: 500 } }).catch(() => {});
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('pasa las respuestas exitosas sin modificarlas', () => {
    const fn = globalThis.__apiCaptured?.responseSuccess;
    if (!fn) return;
    const response = { data: { ok: true }, status: 200 };
    expect(fn(response)).toEqual(response);
  });
});