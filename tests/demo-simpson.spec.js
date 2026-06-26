import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 1920, height: 1080 },
  // MAGIA: En GitHub Actions (CI) va a toda velocidad. En tu computadora local, irá lento para el jurado.
  launchOptions: process.env.CI ? {} : { slowMo: 800 },
});

test('Flujo E2E: Registro, Compra, Landing de Simpsons Burguer y Soporte', async ({ page }) => {

  test.setTimeout(300000); // 5 minutos máximo por test

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

  // Esperamos dinámicamente hasta 5 segundos a que la página procese el registro
  await page.waitForURL(/.*login/, { timeout: 5000 }).catch(() => {});

  // ==========================================
  // 2. INICIO DE SESIÓN
  // ==========================================
  await page.goto('http://localhost:5173/login');
  await page.getByRole('textbox', { name: 'tu@correo.com' }).fill(correoUnico);
  await page.getByRole('textbox', { name: '••••••••' }).fill('lokillo124');
  await page.getByRole('main').getByRole('button', { name: 'Iniciar Sesión' }).click();

  // Validamos que inició sesión esperando que aparezca el botón "Mi cuenta"
  const btnCuenta = page.getByRole('button', { name: /Mi cuenta Hector/i });
  await expect(btnCuenta).toBeVisible({ timeout: 15000 });

  // ==========================================
  // 3. COMPRA DEL PLAN PREMIUM
  // ==========================================
  await btnCuenta.click();
  await page.getByRole('link', { name: 'Ver planes' }).click({ force: true });

  const planPremium = page.getByRole('button', { name: 'Obtener Premium' });
  await planPremium.hover(); 
  await planPremium.click();

  // Esperamos que cargue la pasarela de pago (reemplaza los 10s fijos)
  const inputTarjeta = page.getByRole('textbox', { name: '5678 9012 3456' });
  await expect(inputTarjeta).toBeVisible({ timeout: 15000 });

  await inputTarjeta.fill('4539 1488 0343 6467');
  await page.getByRole('textbox', { name: 'NOMBRE APELLIDO' }).fill('HECTOR AGUERO CARCAMO');
  await page.getByRole('textbox', { name: 'MM/AA' }).fill('12/28');
  await page.getByRole('textbox', { name: '•••' }).fill('123');
  await page.getByRole('button', { name: 'Pagar $10 USD' }).click();

  // Validamos que nos mande al Wizard esperando el primer campo
  const inputNombreProyecto = page.getByRole('textbox', { name: 'Nombre del proyecto o negocio' });
  await expect(inputNombreProyecto).toBeVisible({ timeout: 15000 });

  // ==========================================
  // 4. WIZARD: CREACIÓN DE LANDING PAGE
  // ==========================================
  await inputNombreProyecto.fill('Simpsons Burguer');
  await page.getByRole('textbox', { name: 'Propuesta de valor' }).fill('Hamburguesas tan irresistibles que hasta Homero dejaría sus preciadas donas. Viaja directo a Springfield en cada mordisco con nuestras hamburguesas artesanales de tamaño épico, ingredientes frescos y una vibra increíble para compartir con amigos');
  await page.getByRole('textbox', { name: 'Llamado a la acción' }).fill('Compra ya.');
  await page.getByRole('button', { name: /Gastronomía/i }).click();
  await page.getByRole('button', { name: /Vender/i }).click();
  await page.getByRole('button', { name: /Jóvenes/i }).click();
  await page.getByRole('button', { name: /Calidad-precio/i }).click();
  await page.getByRole('button', { name: /Marca nueva/i }).click();
  
  await page.getByRole('button', { name: 'Continuar →' }).click();

  // Validamos Paso 2
  await expect(page.getByRole('button', { name: /Elegante/i })).toBeVisible({ timeout: 10000 });
  await page.getByRole('button', { name: /Elegante/i }).click();
  await page.getByRole('group').filter({ hasText: 'Color primario' }).getByLabel('Color Rojo vibrante').click();
  await page.getByRole('group').filter({ hasText: 'Color secundario' }).getByLabel('Color Dorado').click();
  await page.getByRole('button', { name: /Mixto/i }).click();
  await page.getByRole('button', { name: /Alto/i }).click();
  
  await page.getByRole('button', { name: 'Continuar →' }).click();

  // Validamos Paso 3
  await expect(page.getByRole('button', { name: /Audaz/i })).toBeVisible({ timeout: 10000 });
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
  
  await page.getByRole('button', { name: 'Continuar →' }).click();

  // Validamos Paso 4
  await expect(page.getByRole('button', { name: /Clash Display/i })).toBeVisible({ timeout: 10000 });
  await page.getByRole('button', { name: /Clash Display/i }).click();
  await page.getByRole('button', { name: /Píldora/i }).click();
  await page.getByRole('button', { name: 'Gradiente Degradado primario' }).click();
  await page.getByRole('button', { name: /Full-width/i }).click();
  await page.getByRole('button', { name: /Expresiva/i }).click();
  await page.getByRole('button', { name: /Parallax/i }).click();
  await page.getByRole('button', { name: 'Gradiente vivo Fondo con' }).click();
  
  await page.getByRole('button', { name: 'Continuar →' }).click();

  // ==========================================
  // 5. GENERACIÓN Y VISUALIZACIÓN
  // ==========================================
  const btnGenerar = page.getByRole('button', { name: 'Generar mi landing page' });
  await expect(btnGenerar).toBeVisible({ timeout: 10000 });
  await btnGenerar.click();

  // ESTA ES LA ÚNICA ESPERA LARGA PERMITIDA: La IA procesando (hasta 2 minutos)
  const btnVerLanding = page.getByRole('link', { name: 'Ver mi landing page →' });
  await btnVerLanding.waitFor({ state: 'visible', timeout: 120000 });

  const pageLandingPromise = page.waitForEvent('popup');
  await btnVerLanding.click();
  const pageLanding = await pageLandingPromise;

  await pageLanding.waitForLoadState('domcontentloaded');

  // Navegación en la landing generada a máxima velocidad
  await pageLanding.getByRole('link', { name: 'Cómo funciona' }).first().click();
  await pageLanding.getByRole('link', { name: 'Clientes' }).first().click();
  await pageLanding.getByRole('link', { name: 'Precios' }).first().click();
  await pageLanding.getByRole('link', { name: 'FAQ' }).first().click();
  await pageLanding.getByRole('link', { name: 'Compra ya', exact: true }).first().click();
  
  await pageLanding.close();

  // ==========================================
  // 6. DASHBOARD Y SOPORTE
  // ==========================================
  await page.getByRole('button', { name: /Mi cuenta Hector/i }).click();
  await page.getByRole('link', { name: 'Mi dashboard' }).click({ force: true });
  
  // Validamos que llegamos al dashboard
  await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

  await page.getByRole('link', { name: 'Ver historial Mis proyectos' }).click({ force: true });

  // Validamos que el botón de soporte es visible antes de hacer click
  const btnSoporte = page.getByRole('navigation').getByRole('link', { name: 'Soporte' });
  await expect(btnSoporte).toBeVisible({ timeout: 10000 });
  await btnSoporte.click();

  await page.getByRole('textbox', { name: 'Nombre Completo' }).fill('Hector Agüero Carcamo');
  await page.getByRole('textbox', { name: 'Correo Electrónico' }).fill(correoUnico);
  await page.locator('textarea[name="message"]').fill('Gracias por la pagina, un saludo.');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();

  await page.getByRole('link', { name: 'WebLandingSuite Logo' }).click();
  // Validamos retorno a home
  await expect(page).toHaveURL('http://localhost:5173/', { timeout: 10000 });
});