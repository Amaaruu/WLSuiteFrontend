import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 1920, height: 1080 },
  launchOptions: {
    slowMo: 800,
  }
});

test('Flujo E2E: Registro, Compra, Landing de Simpsons Burguer y Soporte', async ({ page }) => {

  test.setTimeout(300000);

  const correoUnico = `hector_${Date.now()}@gmail.com`;

  // ==========================================
  // 1. REGISTRO DE USUARIO
  // ==========================================
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Registrarse' }).click();

  await page.locator('input[name="name"]').fill('Hector');
  await page.locator('input[name="lastname"]').fill('Agüero'); 
  await page.locator('input[name="email"]').fill(correoUnico);
  await page.getByRole('textbox', { name: 'Mínimo 8 caracteres' }).first().fill('lokillo124');
  await page.getByRole('textbox', { name: 'Repite tu contraseña' }).fill('lokillo124');
  await page.getByRole('button', { name: 'Crear cuenta' }).click();

  await page.waitForTimeout(2000); 

  // ==========================================
  // 2. INICIO DE SESIÓN
  // ==========================================
  await page.goto('http://localhost:5173/login');
  await page.getByRole('textbox', { name: 'tu@correo.com' }).fill(correoUnico);
  await page.getByRole('textbox', { name: '••••••••' }).fill('lokillo124');
  await page.getByRole('main').getByRole('button', { name: 'Iniciar Sesión' }).click();

  // ==========================================
  // 3. COMPRA DEL PLAN PREMIUM
  // ==========================================
  await page.getByRole('button', { name: /Mi cuenta Hector/i }).click();
  await page.waitForTimeout(500); 
  await page.getByRole('link', { name: 'Ver planes' }).click({ force: true });

  const planPremium = page.getByRole('button', { name: 'Obtener Premium' });
  await planPremium.hover(); 
  await page.waitForTimeout(10000); 
  
  await planPremium.click();

  await page.getByRole('textbox', { name: '5678 9012 3456' }).fill('4539 1488 0343 6467');
  await page.getByRole('textbox', { name: 'NOMBRE APELLIDO' }).fill('HECTOR AGUERO CARCAMO');
  await page.getByRole('textbox', { name: 'MM/AA' }).fill('12/28');
  await page.getByRole('textbox', { name: '•••' }).fill('123');
  await page.getByRole('button', { name: 'Pagar $10 USD' }).click();
  await page.waitForTimeout(10000); 

  // ==========================================
  // 4. WIZARD: CREACIÓN DE LANDING PAGE
  // ==========================================
  await page.getByRole('textbox', { name: 'Nombre del proyecto o negocio' }).fill('Simpsons Burguer');
  await page.getByRole('textbox', { name: 'Propuesta de valor' }).fill('Hamburguesas tan irresistibles que hasta Homero dejaría sus preciadas donas. Viaja directo a Springfield en cada mordisco con nuestras hamburguesas artesanales de tamaño épico, ingredientes frescos y una vibra increíble para compartir con amigos');
  await page.getByRole('textbox', { name: 'Llamado a la acción' }).fill('Compra ya.');
  await page.getByRole('button', { name: /Gastronomía/i }).click();
  await page.getByRole('button', { name: /Vender/i }).click();
  await page.getByRole('button', { name: /Jóvenes/i }).click();
  await page.getByRole('button', { name: /Calidad-precio/i }).click();
  await page.getByRole('button', { name: /Marca nueva/i }).click();
  
  await page.waitForTimeout(10000); 
  await page.getByRole('button', { name: 'Continuar →' }).click();

  await page.getByRole('button', { name: /Elegante/i }).click();
  await page.getByRole('group').filter({ hasText: 'Color primario' }).getByLabel('Color Rojo vibrante').click();
  await page.getByRole('group').filter({ hasText: 'Color secundario' }).getByLabel('Color Dorado').click();
  await page.getByRole('button', { name: /Mixto/i }).click();
  await page.getByRole('button', { name: /Alto/i }).click();
  
  await page.waitForTimeout(10000);
  await page.getByRole('button', { name: 'Continuar →' }).click();

  await page.getByRole('button', { name: /Audaz/i }).click();
  await page.getByRole('button', { name: /Dominante/i }).click();
  await page.getByRole('button', { name: /Compacto/i }).click();
  await page.getByRole('button', { name: /Con formas/i }).click();
  await page.getByRole('switch').nth(2).click();
  await page.getByRole('switch').nth(3).click();
  await page.getByRole('switch').nth(5).click();
  await page.getByRole('switch').nth(4).click();

  await page.locator('input[type="file"]').first().setInputFiles('tests/portada.jpg');
  await page.locator('input[type="file"]').nth(1).setInputFiles('tests/logo.jpg');
  
  await page.waitForTimeout(10000);
  await page.getByRole('button', { name: 'Continuar →' }).click();

  await page.getByRole('button', { name: /Clash Display/i }).click();
  await page.getByRole('button', { name: /Píldora/i }).click();
  await page.getByRole('button', { name: 'Gradiente Degradado primario' }).click();
  await page.getByRole('button', { name: /Full-width/i }).click();
  await page.getByRole('button', { name: /Expresiva/i }).click();
  await page.getByRole('button', { name: /Parallax/i }).click();
  await page.getByRole('button', { name: 'Gradiente vivo Fondo con' }).click();
  
  await page.waitForTimeout(10000);
  await page.getByRole('button', { name: 'Continuar →' }).click();

  // ==========================================
  // 5. GENERACIÓN Y VISUALIZACIÓN
  // ==========================================
  await page.getByRole('button', { name: 'Generar mi landing page' }).click();

  const btnVerLanding = page.getByRole('link', { name: 'Ver mi landing page →' });
  await btnVerLanding.waitFor({ state: 'visible', timeout: 120000 });

  const pageLandingPromise = page.waitForEvent('popup');
  await btnVerLanding.click();
  const pageLanding = await pageLandingPromise;

  await pageLanding.waitForLoadState('domcontentloaded');

  await pageLanding.getByRole('link', { name: 'Cómo funciona' }).first().click();
  await page.waitForTimeout(2000);
  await pageLanding.getByRole('link', { name: 'Clientes' }).first().click();
  await page.waitForTimeout(2000);
  await pageLanding.getByRole('link', { name: 'Precios' }).first().click();
  await page.waitForTimeout(2000);
  await pageLanding.getByRole('link', { name: 'FAQ' }).first().click();
  await page.waitForTimeout(2000);
  await pageLanding.getByRole('link', { name: 'Compra ya', exact: true }).first().click();
  await page.waitForTimeout(9000); // Pausa dramática para el jurado
  
  await pageLanding.close();

  // ==========================================
  // 6. DASHBOARD Y SOPORTE
  // ==========================================
  await page.getByRole('button', { name: /Mi cuenta Hector/i }).click();
  await page.waitForTimeout(2000); 
  
  await page.getByRole('link', { name: 'Mi dashboard' }).click({ force: true });
  await page.waitForTimeout(2000);
  await page.getByRole('link', { name: 'Ver historial Mis proyectos' }).click({ force: true });
  
  await page.waitForTimeout(5000); 

  await page.getByRole('navigation').getByRole('link', { name: 'Soporte' }).click();
  await page.getByRole('textbox', { name: 'Nombre Completo' }).fill('Hector Agüero Carcamo');
  await page.getByRole('textbox', { name: 'Correo Electrónico' }).fill(correoUnico);
  await page.locator('textarea[name="message"]').fill('Gracias por la pagina, un saludo.');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  
  await page.waitForTimeout(10000);

  await page.getByRole('link', { name: 'WebLandingSuite Logo' }).click();
  await page.waitForTimeout(10000);
});