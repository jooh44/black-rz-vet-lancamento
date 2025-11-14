const { test } = require('@playwright/test');
const fs = require('fs');

test('Análise Completa de Performance Mobile', async ({ page, browser }) => {
  const results = {
    timestamp: new Date().toISOString(),
    metrics: {},
    issues: [],
    recommendations: []
  };

  // Simular iPhone 12 Pro
  await page.setViewportSize({ width: 390, height: 844 });
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  });

  console.log(' Iniciando análise de performance mobile...\n');

  // Medir tempo de carregamento
  const startTime = Date.now();
  const response = await page.goto('http://72.60.150.75/promocoes.html', { 
    waitUntil: 'networkidle',
    timeout: 60000 
  });
  const loadTime = Date.now() - startTime;
  
  results.metrics.loadTime = loadTime;
  console.log(`  Tempo de carregamento: ${loadTime}ms`);
  
  if (loadTime > 3000) {
    results.issues.push({
      severity: 'high',
      issue: 'Tempo de carregamento muito alto',
      value: `${loadTime}ms`,
      recommendation: 'Deve ser < 3000ms para boa experiência mobile'
    });
  }

  // Analisar recursos carregados
  const metrics = await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource');
    
    return {
      dom: {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        domComplete: perfData.domComplete - perfData.fetchStart
      },
      resources: {
        total: resources.length,
        css: resources.filter(r => r.name.includes('.css')).length,
        js: resources.filter(r => r.name.includes('.js')).length,
        images: resources.filter(r => r.initiatorType === 'img' || r.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)).length,
        fonts: resources.filter(r => r.name.includes('fonts')).length
      },
      timing: {
        ttfb: perfData.responseStart - perfData.requestStart,
        domInteractive: perfData.domInteractive - perfData.fetchStart,
        loadComplete: perfData.loadEventEnd - perfData.fetchStart
      }
    };
  });

  console.log('\n Métricas detalhadas:');
  console.log('  DOM Content Loaded:', metrics.dom.domContentLoaded, 'ms');
  console.log('  DOM Complete:', metrics.dom.domComplete, 'ms');
  console.log('  TTFB:', metrics.timing.ttfb, 'ms');
  console.log('  Time to Interactive:', metrics.timing.domInteractive, 'ms');
  
  console.log('\n Recursos carregados:');
  console.log('  Total:', metrics.resources.total);
  console.log('  CSS:', metrics.resources.css);
  console.log('  JavaScript:', metrics.resources.js);
  console.log('  Imagens:', metrics.resources.images);
  console.log('  Fontes:', metrics.resources.fonts);

  results.metrics = { ...results.metrics, ...metrics };

  // Verificar problemas de scroll/touch
  console.log('\n  Testando scroll e interatividade...');
  
  const scrollTest = await page.evaluate(() => {
    const issues = [];
    
    // Verificar overflow-x
    const body = document.body;
    const html = document.documentElement;
    if (body.scrollWidth > window.innerWidth || html.scrollWidth > window.innerWidth) {
      issues.push('Scroll horizontal detectado - pode causar UX ruim');
    }
    
    // Verificar elementos com touch-action
    const allElements = document.querySelectorAll('*');
    let withoutTouchAction = 0;
    allElements.forEach(el => {
      const style = window.getComputedStyle(el);
      if (el.tagName === 'BUTTON' || el.tagName === 'A') {
        if (!style.touchAction || style.touchAction === 'auto') {
          withoutTouchAction++;
        }
      }
    });
    
    if (withoutTouchAction > 0) {
      issues.push(`${withoutTouchAction} elementos interativos sem touch-action otimizado`);
    }
    
    return issues;
  });

  scrollTest.forEach(issue => {
    console.log('   ', issue);
    results.issues.push({ severity: 'medium', issue });
  });

  // Testar smooth scroll
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(100);
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(100);
  await page.evaluate(() => window.scrollTo(0, 0));
  
  console.log('   Scroll testado');

  // Verificar imagens sem lazy loading
  const imageIssues = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    const issues = [];
    
    images.forEach(img => {
      if (!img.loading) {
        issues.push(`Imagem sem loading attribute: ${img.src.split('/').pop()}`);
      }
      if (!img.width || !img.height) {
        issues.push(`Imagem sem dimensões: ${img.src.split('/').pop()}`);
      }
    });
    
    return issues;
  });

  if (imageIssues.length > 0) {
    console.log('\n  Problemas com imagens:');
    imageIssues.slice(0, 5).forEach(issue => {
      console.log('   ', issue);
      results.issues.push({ severity: 'low', issue });
    });
    if (imageIssues.length > 5) {
      console.log(`  ... e mais ${imageIssues.length - 5} problemas`);
    }
  }

  // Verificar animações com will-change
  const animationIssues = await page.evaluate(() => {
    const animated = document.querySelectorAll('[class*="carousel"], [class*="slide"], [class*="ticker"]');
    const issues = [];
    
    animated.forEach(el => {
      const style = window.getComputedStyle(el);
      if (!style.willChange || style.willChange === 'auto') {
        issues.push(`Elemento animado sem will-change: ${el.className}`);
      }
    });
    
    return issues;
  });

  if (animationIssues.length > 0) {
    console.log('\n Problemas com animações:');
    animationIssues.forEach(issue => {
      console.log('   ', issue);
      results.issues.push({ severity: 'medium', issue });
    });
  }

  // Teste de interação com carrossel
  console.log('\n Testando carrossel de banners...');
  try {
    await page.waitForSelector('.hero-carousel__next', { timeout: 5000 });
    
    // Medir FPS durante interação
    const fpsStart = Date.now();
    await page.click('.hero-carousel__next');
    await page.waitForTimeout(600); // Esperar transição
    const fpsDuration = Date.now() - fpsStart;
    
    console.log(`    Transição de slide: ${fpsDuration}ms`);
    
    if (fpsDuration > 300) {
      results.issues.push({
        severity: 'high',
        issue: 'Transição do carrossel lenta',
        value: `${fpsDuration}ms`,
        recommendation: 'Deve ser < 300ms para parecer fluida'
      });
    }
  } catch (e) {
    console.log('    Erro ao testar carrossel:', e.message);
  }

  // Gerar recomendações
  console.log('\n Recomendações:');
  
  if (metrics.resources.images > 10) {
    const rec = 'Implementar lazy loading progressivo para imagens';
    console.log('  ', rec);
    results.recommendations.push(rec);
  }
  
  if (metrics.timing.ttfb > 200) {
    const rec = 'Otimizar TTFB do servidor (considerar cache, CDN)';
    console.log('  ', rec);
    results.recommendations.push(rec);
  }
  
  if (loadTime > 3000) {
    const rec = 'Reduzir JavaScript inicial (code splitting, defer)';
    console.log('  ', rec);
    results.recommendations.push(rec);
  }

  const rec1 = 'Adicionar will-change em elementos animados';
  const rec2 = 'Adicionar touch-action: manipulation em botões';
  const rec3 = 'Usar transform e opacity para animações (GPU)';
  const rec4 = 'Considerar IntersectionObserver para lazy load';
  
  console.log('  ', rec1);
  console.log('  ', rec2);
  console.log('  ', rec3);
  console.log('  ', rec4);
  
  results.recommendations.push(rec1, rec2, rec3, rec4);

  // Salvar resultados
  fs.writeFileSync('mobile-performance-report.json', JSON.stringify(results, null, 2));
  console.log('\n Relatório salvo em: mobile-performance-report.json');
  
  console.log('\n' + '='.repeat(60));
  console.log('RESUMO DA ANÁLISE');
  console.log('='.repeat(60));
  console.log(`  Tempo de carregamento: ${loadTime}ms`);
  console.log(`  Problemas encontrados: ${results.issues.length}`);
  console.log(` Recomendações: ${results.recommendations.length}`);
  console.log('='.repeat(60));
});
