const { test, expect } = require('@playwright/test');

// Configuração do iPhone 8 Plus
const iPhone8Plus = {
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
  viewport: {
    width: 414,
    height: 736,
  },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
};

// URL do site em produção (ajustar se necessário)
// Testando diretamente no IP da VPS
const PRODUCTION_URL = 'http://72.60.150.75'; // IP da VPS

test.describe('Banners Mobile - iPhone 8 Plus (VPS)', () => {
  test('Deve carregar banners mobile no iPhone 8 Plus - VPS', async ({ page, context }) => {
    // Configurar contexto como iPhone 8 Plus
    await context.setExtraHTTPHeaders({
      'User-Agent': iPhone8Plus.userAgent,
    });
    
    await page.setViewportSize({
      width: iPhone8Plus.viewport.width,
      height: iPhone8Plus.viewport.height,
    });

    // Acessar o site em produção
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle', timeout: 30000 });

    // Aguardar carregamento dos banners
    await page.waitForTimeout(3000);

    // Verificar se o container de banners existe
    const carouselContainer = page.locator('.hero-carousel');
    await expect(carouselContainer).toBeVisible({ timeout: 10000 });

    // Verificar se há slides de banners
    const slides = page.locator('.hero-carousel__slide');
    const slideCount = await slides.count();
    console.log(`[VPS Test] Número de slides encontrados: ${slideCount}`);
    expect(slideCount).toBeGreaterThan(0);

    // Verificar se pelo menos um slide está ativo
    const activeSlide = page.locator('.hero-carousel__slide--active');
    await expect(activeSlide).toBeVisible({ timeout: 5000 });

    // Verificar se as imagens mobile estão sendo usadas (não desktop)
    const bannerImages = page.locator('.hero-carousel__slide-image');
    const imageCount = await bannerImages.count();
    console.log(`[VPS Test] Número de imagens encontradas: ${imageCount}`);
    expect(imageCount).toBeGreaterThan(0);

    // Verificar se as imagens têm src mobile (não desktop)
    for (let i = 0; i < imageCount; i++) {
      const img = bannerImages.nth(i);
      const src = await img.getAttribute('src');
      const dataMobile = await img.getAttribute('data-mobile');
      const dataDesktop = await img.getAttribute('data-desktop');

      console.log(`[VPS Test] Imagem ${i + 1}:`);
      console.log(`  - src: ${src}`);
      console.log(`  - data-mobile: ${dataMobile}`);
      console.log(`  - data-desktop: ${dataDesktop}`);

      // Verificar se está usando imagem mobile
      if (src && src.includes('/banners/')) {
        expect(src).toContain('/banners/mobile/');
        expect(src).not.toContain('/banners/desktop/');
      }

      // Verificar se a imagem carregou
      const isVisible = await img.isVisible();
      console.log(`  - Visível: ${isVisible}`);
      
      // Verificar se a imagem realmente carregou (não é placeholder)
      const naturalWidth = await img.evaluate(el => el.naturalWidth);
      const naturalHeight = await img.evaluate(el => el.naturalHeight);
      console.log(`  - Dimensões: ${naturalWidth}x${naturalHeight}`);
      
      if (isVisible) {
        expect(naturalWidth).toBeGreaterThan(0);
        expect(naturalHeight).toBeGreaterThan(0);
      }
    }

    // Screenshot para debug
    await page.screenshot({ path: 'tests/screenshots/iphone8plus-banners.png', fullPage: false });
  });

  test('Deve carregar banners.json corretamente - VPS', async ({ page, context }) => {
    await context.setExtraHTTPHeaders({
      'User-Agent': iPhone8Plus.userAgent,
    });
    
    await page.setViewportSize({
      width: iPhone8Plus.viewport.width,
      height: iPhone8Plus.viewport.height,
    });

    // Interceptar requisição do banners.json
    const bannersResponse = await page.goto(`${PRODUCTION_URL}/data/banners.json`, { timeout: 30000 });
    expect(bannersResponse.status()).toBe(200);

    const bannersData = await bannersResponse.json();
    expect(bannersData).toHaveProperty('heroBanners');
    expect(Array.isArray(bannersData.heroBanners)).toBe(true);
    expect(bannersData.heroBanners.length).toBeGreaterThan(0);

    // Verificar se cada banner tem imagem mobile
    bannersData.heroBanners.forEach((banner, index) => {
      if (banner.active) {
        expect(banner).toHaveProperty('imageMobile');
        expect(banner.imageMobile).toContain('/banners/mobile/');
        console.log(`[VPS Test] Banner ${index + 1} (${banner.id}): ${banner.imageMobile}`);
      }
    });
  });

  test('Deve usar imagens mobile e nunca desktop no iPhone 8 Plus - VPS', async ({ page, context }) => {
    await context.setExtraHTTPHeaders({
      'User-Agent': iPhone8Plus.userAgent,
    });
    
    await page.setViewportSize({
      width: iPhone8Plus.viewport.width,
      height: iPhone8Plus.viewport.height,
    });

    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Verificar window.innerWidth via JavaScript
    const innerWidth = await page.evaluate(() => window.innerWidth);
    console.log(`[VPS Test] window.innerWidth: ${innerWidth}`);
    expect(innerWidth).toBeLessThan(768);

    // Verificar matchMedia
    const isMobileMatchMedia = await page.evaluate(() => {
      return window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
    });
    console.log(`[VPS Test] matchMedia (max-width: 767px): ${isMobileMatchMedia}`);
    expect(isMobileMatchMedia).toBe(true);

    // Verificar função isMobileDevice
    const isMobileDevice = await page.evaluate(() => {
      if (typeof isMobileDevice === 'function') {
        return isMobileDevice();
      }
      return null;
    });
    console.log(`[VPS Test] isMobileDevice(): ${isMobileDevice}`);

    // Verificar todas as imagens de banner
    const bannerImages = page.locator('.hero-carousel__slide-image');
    const imageCount = await bannerImages.count();
    console.log(`[VPS Test] Total de imagens: ${imageCount}`);
    
    for (let i = 0; i < imageCount; i++) {
      const img = bannerImages.nth(i);
      const src = await img.getAttribute('src');
      
      console.log(`[VPS Test] Imagem ${i + 1} src: ${src}`);
      
      // CRÍTICO: Verificar que NUNCA está usando desktop
      if (src && src.includes('/banners/')) {
        expect(src).not.toContain('/banners/desktop/');
        expect(src).toContain('/banners/mobile/');
      }
    }
  });

  test('Deve ter console logs de debug - VPS', async ({ page, context }) => {
    const consoleMessages = [];
    
    page.on('console', msg => {
      if (msg.text().includes('[Banners]')) {
        consoleMessages.push(msg.text());
        console.log(`[Console] ${msg.text()}`);
      }
    });

    await context.setExtraHTTPHeaders({
      'User-Agent': iPhone8Plus.userAgent,
    });
    
    await page.setViewportSize({
      width: iPhone8Plus.viewport.width,
      height: iPhone8Plus.viewport.height,
    });

    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Verificar se há logs de banner
    console.log(`[VPS Test] Console messages encontrados: ${consoleMessages.length}`);
    consoleMessages.forEach(msg => console.log(`  - ${msg}`));
  });
});

