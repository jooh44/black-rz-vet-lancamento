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

test.describe('Banners Mobile - iPhone 8 Plus', () => {
  test('Deve carregar banners mobile no iPhone 8 Plus', async ({ page, context }) => {
    // Configurar contexto como iPhone 8 Plus
    await context.setExtraHTTPHeaders({
      'User-Agent': iPhone8Plus.userAgent,
    });
    
    await page.setViewportSize({
      width: iPhone8Plus.viewport.width,
      height: iPhone8Plus.viewport.height,
    });

    // Acessar o site
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Aguardar carregamento dos banners
    await page.waitForTimeout(2000);

    // Verificar se o container de banners existe
    const carouselContainer = page.locator('.hero-carousel');
    await expect(carouselContainer).toBeVisible();

    // Verificar se há slides de banners
    const slides = page.locator('.hero-carousel__slide');
    const slideCount = await slides.count();
    expect(slideCount).toBeGreaterThan(0);

    // Verificar se pelo menos um slide está ativo
    const activeSlide = page.locator('.hero-carousel__slide--active');
    await expect(activeSlide).toBeVisible();

    // Verificar se as imagens mobile estão sendo usadas (não desktop)
    const bannerImages = page.locator('.hero-carousel__slide-image');
    const imageCount = await bannerImages.count();
    expect(imageCount).toBeGreaterThan(0);

    // Verificar se as imagens têm src mobile (não desktop)
    for (let i = 0; i < imageCount; i++) {
      const img = bannerImages.nth(i);
      const src = await img.getAttribute('src');
      const dataMobile = await img.getAttribute('data-mobile');
      const dataDesktop = await img.getAttribute('data-desktop');

      console.log(`[Teste] Imagem ${i + 1}:`);
      console.log(`  - src: ${src}`);
      console.log(`  - data-mobile: ${dataMobile}`);
      console.log(`  - data-desktop: ${dataDesktop}`);

      // Verificar se está usando imagem mobile
      if (dataMobile) {
        expect(src).toContain('/banners/mobile/');
        expect(src).not.toContain('/banners/desktop/');
      }

      // Verificar se a imagem carregou
      const isVisible = await img.isVisible();
      expect(isVisible).toBe(true);
    }
  });

  test('Deve carregar banners.json corretamente', async ({ page, context }) => {
    await context.setExtraHTTPHeaders({
      'User-Agent': iPhone8Plus.userAgent,
    });
    
    await page.setViewportSize({
      width: iPhone8Plus.viewport.width,
      height: iPhone8Plus.viewport.height,
    });

    // Interceptar requisição do banners.json
    const bannersResponse = await page.goto('http://localhost:3000/data/banners.json');
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
        console.log(`[Teste] Banner ${index + 1} (${banner.id}): ${banner.imageMobile}`);
      }
    });
  });

  test('Deve mostrar fallback se banners não carregarem', async ({ page, context }) => {
    await context.setExtraHTTPHeaders({
      'User-Agent': iPhone8Plus.userAgent,
    });
    
    await page.setViewportSize({
      width: iPhone8Plus.viewport.width,
      height: iPhone8Plus.viewport.height,
    });

    // Bloquear requisição do banners.json para simular falha
    await page.route('**/data/banners.json', route => route.abort());

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Aguardar tempo suficiente para retry e fallback
    await page.waitForTimeout(5000);

    // Verificar se há algum conteúdo no carousel (fallback ou banners)
    const carouselContainer = page.locator('.hero-carousel');
    await expect(carouselContainer).toBeVisible();

    const slides = page.locator('.hero-carousel__slide');
    const slideCount = await slides.count();
    
    // Deve ter pelo menos um slide (banner ou fallback)
    expect(slideCount).toBeGreaterThan(0);
  });

  test('Deve usar imagens mobile e nunca desktop no iPhone 8 Plus', async ({ page, context }) => {
    await context.setExtraHTTPHeaders({
      'User-Agent': iPhone8Plus.userAgent,
    });
    
    await page.setViewportSize({
      width: iPhone8Plus.viewport.width,
      height: iPhone8Plus.viewport.height,
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Verificar window.innerWidth via JavaScript
    const innerWidth = await page.evaluate(() => window.innerWidth);
    console.log(`[Teste] window.innerWidth: ${innerWidth}`);
    expect(innerWidth).toBeLessThan(768);

    // Verificar matchMedia
    const isMobileMatchMedia = await page.evaluate(() => {
      return window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
    });
    console.log(`[Teste] matchMedia (max-width: 767px): ${isMobileMatchMedia}`);
    expect(isMobileMatchMedia).toBe(true);

    // Verificar todas as imagens de banner
    const bannerImages = page.locator('.hero-carousel__slide-image');
    const imageCount = await bannerImages.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = bannerImages.nth(i);
      const src = await img.getAttribute('src');
      
      // CRÍTICO: Verificar que NUNCA está usando desktop
      if (src) {
        expect(src).not.toContain('/banners/desktop/');
        if (src.includes('/banners/')) {
          expect(src).toContain('/banners/mobile/');
        }
      }
    }
  });

  test('Deve atualizar banners ao rotacionar dispositivo', async ({ page, context }) => {
    await context.setExtraHTTPHeaders({
      'User-Agent': iPhone8Plus.userAgent,
    });
    
    // Começar em portrait
    await page.setViewportSize({
      width: 414,
      height: 736,
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Verificar imagens em portrait
    const bannerImagesPortrait = page.locator('.hero-carousel__slide-image');
    const srcPortrait = await bannerImagesPortrait.first().getAttribute('src');
    console.log(`[Teste] Portrait src: ${srcPortrait}`);

    // Rotacionar para landscape
    await page.setViewportSize({
      width: 736,
      height: 414,
    });

    // Simular orientationchange
    await page.evaluate(() => {
      window.dispatchEvent(new Event('orientationchange'));
    });

    await page.waitForTimeout(500);

    // Verificar se ainda está usando mobile (mesmo em landscape, se width < 768)
    const innerWidth = await page.evaluate(() => window.innerWidth);
    console.log(`[Teste] Landscape innerWidth: ${innerWidth}`);
    
    if (innerWidth < 768) {
      const srcLandscape = await bannerImagesPortrait.first().getAttribute('src');
      console.log(`[Teste] Landscape src: ${srcLandscape}`);
      expect(srcLandscape).toContain('/banners/mobile/');
    }
  });
});

