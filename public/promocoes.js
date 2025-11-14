const productsGrid = document.querySelector("#products-grid");
const currentYearEl = document.querySelector("#current-year");
const countdownControllers = new WeakMap();

const COUNTDOWN_TIME_ZONE = "America/Sao_Paulo";

// Função auxiliar para detectar mobile de forma mais confiável (definida no início)
// Otimizada para performance - cache do resultado
let mobileDeviceCache = null;
function isMobileDevice() {
  if (mobileDeviceCache !== null) return mobileDeviceCache;
  // Usar matchMedia como método principal (mais confiável)
  if (window.matchMedia && window.matchMedia("(max-width: 767px)").matches) {
    mobileDeviceCache = true;
    return true;
  }
  // Fallback para window.innerWidth
  if (window.innerWidth && window.innerWidth < 768) {
    mobileDeviceCache = true;
    return true;
  }
  // Fallback adicional para userAgent (útil em casos extremos)
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())) {
    // Mas só retornar true se realmente for mobile (não tablet em modo desktop)
    mobileDeviceCache = window.innerWidth < 768;
    return mobileDeviceCache;
  }
  mobileDeviceCache = false;
  return false;
}

// Smooth scroll e destaque de navegação ativa
(function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.header-nav__link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-bottom__link');
  const allNavLinks = [...navLinks, ...mobileNavLinks];
  const sections = document.querySelectorAll('[id$="-section"]');
  const mobileNavBottom = document.querySelector('.mobile-nav-bottom');
  const headerNav = document.querySelector('.header-nav');
  const heroCarousel = document.querySelector('.hero-carousel');
  // Usar função auxiliar global para consistência
  const isMobile = () => isMobileDevice();
  
  // Função para detectar se está na hero section
  function isInHeroSection() {
    if (!heroCarousel) return true;
    const heroRect = heroCarousel.getBoundingClientRect();
    const heroBottom = heroRect.bottom;
    const viewportHeight = window.innerHeight;
    // Considera que está na hero se o bottom do carousel ainda está visível acima de 20% da viewport
    // ou se o scroll está muito no topo da página
    return heroBottom > viewportHeight * 0.2 || window.scrollY < 100;
  }
  
  // Função para controlar visibilidade das barras de navegação no mobile
  function updateMobileNavVisibility() {
    if (!isMobile()) {
      // Desktop: sempre mostrar header-nav, esconder mobile-nav-bottom
      if (mobileNavBottom) mobileNavBottom.classList.remove('is-visible');
      if (headerNav) headerNav.style.display = '';
      return;
    }
    
    // Mobile: mostrar/esconder conforme posição
    const inHero = isInHeroSection();
    
    if (inHero) {
      // Na hero: mostrar header-nav, esconder mobile-nav-bottom
      if (mobileNavBottom) mobileNavBottom.classList.remove('is-visible');
      if (headerNav) {
        headerNav.style.display = '';
        headerNav.style.opacity = '1';
      }
    } else {
      // Fora da hero: esconder header-nav, mostrar mobile-nav-bottom
      if (headerNav) {
        headerNav.style.opacity = '0';
        headerNav.style.pointerEvents = 'none';
      }
      if (mobileNavBottom) mobileNavBottom.classList.add('is-visible');
    }
  }
  
  // Smooth scroll suave (funciona para ambos header e mobile)
  allNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const header = document.querySelector('.page-header');
          const headerHeight = header ? header.offsetHeight : 100;
          // No mobile com barra inferior, considerar altura da barra também
          const mobileNavHeight = isMobile() && mobileNavBottom ? mobileNavBottom.offsetHeight : 0;
          const offset = isMobile() 
            ? headerHeight + mobileNavHeight + 20 
            : headerHeight + 20;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
          });
          
          // No mobile, após scroll, atualizar visibilidade
          setTimeout(() => {
            updateMobileNavVisibility();
          }, 100);
        }
      }
    });
  });
  
  // Destacar link ativo baseado na posição do scroll
  function updateActiveLink() {
    const header = document.querySelector('.page-header');
    const headerHeight = header ? header.offsetHeight : 100;
    const mobile = isMobile();
    // Offset ajustado para mobile e desktop
    const scrollOffset = mobile ? headerHeight + 50 : headerHeight + 100;
    const scrollPosition = window.scrollY + scrollOffset;
    
    // Se estiver no topo da página, não destacar nenhum link
    if (window.scrollY < 100) {
      allNavLinks.forEach(link => {
        link.classList.remove('header-nav__link--active', 'mobile-nav-bottom__link--active');
      });
      return;
    }
    
    let activeFound = false;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        allNavLinks.forEach(link => {
          link.classList.remove('header-nav__link--active', 'mobile-nav-bottom__link--active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add(link.classList.contains('mobile-nav-bottom__link') 
              ? 'mobile-nav-bottom__link--active' 
              : 'header-nav__link--active');
            activeFound = true;
          }
        });
      }
    });
    
    // Se não encontrou nenhuma seção ativa, remover todos os estados ativos
    if (!activeFound) {
      allNavLinks.forEach(link => {
        link.classList.remove('header-nav__link--active', 'mobile-nav-bottom__link--active');
      });
    }
  }
  
  // Atualizar ao fazer scroll
  let ticking = false;
  const header = document.querySelector('.page-header');
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveLink();
        updateMobileNavVisibility();
        
        // Adicionar classe quando scrollar
        if (window.scrollY > 50) {
          header?.classList.add('scrolled');
        } else {
          header?.classList.remove('scrolled');
        }
        
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Atualizar ao redimensionar a janela
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateMobileNavVisibility();
      updateActiveLink();
    }, 150);
  });
  
  // Atualizar ao carregar a página
  updateActiveLink();
  updateMobileNavVisibility();
  if (window.scrollY > 50) {
    header?.classList.add('scrolled');
  }
})();

if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

// Funções de countdown (extraídas de app.js)
function getTimeZoneOffsetMs(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  })
    .formatToParts(date)
    .reduce((accumulator, part) => {
      if (part.type !== "literal") {
        accumulator[part.type] = part.value;
      }
      return accumulator;
    }, {});

  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );

  return asUtc - date.getTime();
}

function parseCountdownTarget(rawTarget, timeZone) {
  if (!rawTarget) return null;

  const trimmed = rawTarget.trim();
  if (!trimmed) return null;

  const hasExplicitOffset = /([zZ]|[+-]\d\d:\d\d)$/.test(trimmed);
  if (hasExplicitOffset) {
    const dateWithOffset = new Date(trimmed);
    return Number.isNaN(dateWithOffset.getTime()) ? null : dateWithOffset;
  }

  const [datePart, timePart = "00:00:00"] = trimmed.replace(/\s+/, "T").split("T");
  if (!datePart) return null;

  const [yearString, monthString = "01", dayString = "01"] = datePart.split("-");
  const [hourString = "00", minuteString = "00", secondString = "00"] = timePart.split(":");

  const components = [
    Number(yearString),
    Number(monthString),
    Number(dayString),
    Number(hourString),
    Number(minuteString),
    Number(secondString)
  ];

  if (components.some((value) => Number.isNaN(value))) {
    return null;
  }

  const [year, month, day, hour, minute, second] = components;
  const baseUtcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  const offsetMs = getTimeZoneOffsetMs(baseUtcDate, timeZone);
  return new Date(baseUtcDate.getTime() - offsetMs);
}

function initializeCountdowns() {
  const countdownElements = document.querySelectorAll("[data-target-date]");
  if (!countdownElements.length) return;

  countdownElements.forEach((element) => {
    if (countdownControllers.has(element)) {
      return;
    }

    const rawTarget = element.dataset.targetDate;
    if (!rawTarget) return;

    const targetDate = parseCountdownTarget(rawTarget, COUNTDOWN_TIME_ZONE);

    if (Number.isNaN(targetDate.getTime())) return;

    const partElements = {
      days: element.querySelector('[data-countdown-part="days"]'),
      hours: element.querySelector('[data-countdown-part="hours"]'),
      minutes: element.querySelector('[data-countdown-part="minutes"]'),
      seconds: element.querySelector('[data-countdown-part="seconds"]')
    };

    const hasAllParts = Object.values(partElements).every(Boolean);
    if (!hasAllParts) return;

    function format(value, minLength = 2) {
      return String(Math.max(0, value)).padStart(minLength, "0");
    }

    function updateCountdown() {
      const now = new Date();
      let diffMs = targetDate.getTime() - now.getTime();
      if (diffMs < 0) {
        diffMs = 0;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      partElements.days.textContent = format(days, 2);
      partElements.hours.textContent = format(hours);
      partElements.minutes.textContent = format(minutes);
      partElements.seconds.textContent = format(seconds);

      element.dataset.countdownState = diffMs === 0 ? "finished" : "running";
      element.setAttribute(
        "aria-label",
        diffMs === 0
          ? "Evento iniciado"
          : `Faltam ${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos`
      );

      if (diffMs === 0) {
        const intervalId = countdownControllers.get(element);
        if (intervalId) {
          window.clearInterval(intervalId);
        }
      }
    }

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);
    countdownControllers.set(element, intervalId);
  });
}

// Formatação de preço em Real brasileiro
function formatPrice(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  }).format(value);
}

// Mapear produto para caminho de imagem correto
function getProductImagePath(product, isAccessory = false) {
  const category = isAccessory ? "Insumos" : "Equipamentos";
  const basePath = `/products-images/${category}`;
  
  // Mapeamento de IDs/nomes para nomes de arquivo
  const imageMap = {
    // Equipamentos
    "monitor-rm1200": "RM1200.webp",
    "aparelho-anestesia-vp1000": "VP1000.webp",
    "monitor-rm-700": "RM700.webp",
    "monitor-re700": "RE700.webp",
    "monitor-portatil-r1000": "R1000.webp",
    "monitor-portatil-r200": "R200.webp",
    "bomba-de-seringa-m200a": "M200A.webp",
    "kit-4-bomba-de-seringa": "KIT M200 A WORK.webp",
    "vent-pet-2.0": "VENTPET.webp",
    "central-de-controle-workstation": "workstation_central_de_controle_m200a_ewm200a_595_1_20ab4ea2bacafe1feb3c4bbbc0041310.webp",
    "neurostim": "NEUROSTIM.webp",
    "oximetro": "OXIMETRO.webp",
    // Insumos
    "agulha-tuohy-16g-18g-90mm": "AGULHA TUOHY 16 18.webp",
    "agulha-tuohy-20g-90mm": "AGULHA TUOHY 20X90G.webp",
    "agulha-tuohy-20g-50mm": "AGULHA TUOHY 20X50G.webp",
    "agulha-tuohy-22g-50mm": "AGULHA TUOHY 22X50G.webp",
    "agulha-tuohy-17g-90mm": "AGULHA TUOHY 17.webp",
    "agulha-bloqueio-periferico-21g-100mm": "AGULHA BLOQUEIO 100MM.webp",
    "agulha-bloqueio-periferico-22g-50mm": "AGULHA BLOQUEIO 50MM.webp",
    "multi-injetor-linear-3-aplicadores": "multi injetor 3.webp",
    "balao-latex-reinalacao-250ml": "BALAO 250ML.webp",
    "balao-latex-reinalacao-500ml": "BALAO 500ML.webp",
    "balao-latex-reinalacao-1litro": "BALAO 1 , 2 ,3.webp",
    "balao-latex-reinalacao-2litros": "BALAO 1 , 2 ,3.webp",
    "balao-latex-reinalacao-3litros": "BALAO 1 , 2 ,3.webp",
    "cateter-venoso-central-4fr-5fr": "cateter venoso.webp",
    "cateter-venoso-central-7fr": "cateter venoso.webp",
    "reanimador-manual-ambu": "AMBU.webp",
    "kit-cabo-ecg-03-vias-03-garras": "CABO ECG 3 VIAS.webp",
    "canula-gato-no03-3-5kg": "CANULA GATO.webp",
    "canula-coelho-no02-no03": "CANULA COELHO.webp",
    "atadura-elastica-5cm": "ATADURAS 5 CM.webp",
    "atadura-elastica-10cm": "ATADURAS 10 CM.webp"
  };

  const imageFileName = imageMap[product.id] || imageMap[product.slug];
  
  if (imageFileName) {
    return `${basePath}/${imageFileName}`;
  }

  // Fallback: tentar usar o caminho original se não houver mapeamento
  return product.image || `${basePath}/placeholder.webp`;
}

// Tratamento de erro de imagem simplificado
function handleImageError(imgElement) {
  const placeholder = imgElement.parentElement?.querySelector(".product-card__image-placeholder");
  if (placeholder) {
    imgElement.style.display = "none";
    placeholder.style.display = "flex";
  }
}

// Criar card de produto
function createProductCard(product, isAccessory = false, index = 0) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.setAttribute("role", "listitem");
  card.setAttribute("aria-label", `Produto ${product.name}`);

  const discountBadge = product.discount_percentage
    ? `<div class="product-card__badge" aria-label="Desconto de ${product.discount_percentage}%">
         <span class="product-card__badge-text">-${product.discount_percentage}%</span>
       </div>`
    : "";

  const originalPrice = product.price_original
    ? `<span class="product-card__price-original" aria-label="Preço original ${formatPrice(product.price_original)}">
         ${formatPrice(product.price_original)}
       </span>`
    : "";

  const specificationsList = product.specifications && product.specifications.length > 0
    ? `<ul class="product-card__specs" aria-label="Especificações do produto">
         ${product.specifications.map((spec) => `<li>${spec}</li>`).join("")}
       </ul>`
    : "";

  const imagePath = getProductImagePath(product, isAccessory);
  
  // Primeiros 3 cards de cada seção usam eager loading para carregar imediatamente
  const shouldEagerLoad = index < 3;

  card.innerHTML = `
    <div class="product-card__image-wrapper">
      <img 
        src="${imagePath}" 
        alt="${product.name}" 
        class="product-card__image"
        loading="${shouldEagerLoad ? 'eager' : 'lazy'}"
        decoding="async"
        width="400"
        height="300"
        fetchpriority="${shouldEagerLoad ? 'high' : 'auto'}"
      />
      <div class="product-card__image-placeholder" style="display: none;" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 9h6v6H9z" />
        </svg>
      </div>
      ${discountBadge}
    </div>
    <div class="product-card__content">
      <h3 class="product-card__title">${product.name}</h3>
      ${product.description ? `<p class="product-card__description">${product.description}</p>` : ""}
      <div class="product-card__pricing">
        ${originalPrice}
        <span class="product-card__price-promotional" aria-label="Preço promocional ${formatPrice(product.price_promotional)}">
          ${formatPrice(product.price_promotional)}
        </span>
      </div>
      ${specificationsList}
      <a 
        href="${product.url}" 
        target="_blank" 
        rel="noopener noreferrer"
        class="product-card__button btn-ver-produto"
        aria-label="Ver detalhes do produto ${product.name}"
        data-product-id="${product.id}"
        data-product-name="${product.name}"
      >
        Ver Produto
      </a>
    </div>
  `;

  // Adicionar tratamento de erro de imagem após inserir no DOM
  const imgElement = card.querySelector(".product-card__image");
  if (imgElement) {
    imgElement.addEventListener("error", () => handleImageError(imgElement));
  }

  return card;
}

// Carregar e renderizar produtos
async function loadProducts() {
  try {
    const response = await fetch("/data/products.json");
    if (!response.ok) {
      throw new Error("Falha ao carregar produtos");
    }

    const products = await response.json();
    const availableProducts = products.filter((p) => p.available);

    if (!productsGrid) {
      return;
    }

    if (availableProducts.length === 0) {
      productsGrid.innerHTML = `
        <div class="products-empty" role="alert">
          <p>Produtos temporariamente indisponíveis.</p>
        </div>
      `;
      return;
    }

    // Limpar grid
    productsGrid.innerHTML = "";

    // Renderizar produtos de forma otimizada (batch rendering)
    // Renderizar primeiros cards imediatamente, resto com lazy loading
    const initialBatchSize = 6; // Primeiros 6 cards visíveis
    const batchSize = 4; // Renderizar de 4 em 4
    
    // Renderizar primeiro batch imediatamente
    const initialProducts = availableProducts.slice(0, initialBatchSize);
    initialProducts.forEach((product, index) => {
      const card = createProductCard(product, false, index);
      productsGrid.appendChild(card);
    });

    // Renderizar resto progressivamente usando requestAnimationFrame
    const remainingProducts = availableProducts.slice(initialBatchSize);
    let currentIndex = 0;

    function renderNextBatch() {
      const batch = remainingProducts.slice(currentIndex, currentIndex + batchSize);
      batch.forEach((product, batchIndex) => {
        const globalIndex = initialBatchSize + currentIndex + batchIndex;
        const card = createProductCard(product, false, globalIndex);
        productsGrid.appendChild(card);
      });
      currentIndex += batchSize;

      if (currentIndex < remainingProducts.length) {
        // Usar requestIdleCallback se disponível, senão setTimeout
        if (window.requestIdleCallback) {
          window.requestIdleCallback(renderNextBatch, { timeout: 100 });
        } else {
          setTimeout(renderNextBatch, 0);
        }
      }
    }

    // Iniciar renderização do resto após primeiro frame
    if (remainingProducts.length > 0) {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(renderNextBatch, { timeout: 100 });
      } else {
        requestAnimationFrame(() => {
          setTimeout(renderNextBatch, 0);
        });
      }
    }

    // Meta Pixel: Rastrear visualização de produtos
    if (typeof window.fbq !== "undefined") {
      window.fbq("track", "ViewContent", {
        content_name: "Black Days RZ VET - Produtos",
        content_category: "Equipamentos Veterinários",
        content_type: "product",
        content_ids: availableProducts.map((p) => p.id),
        num_items: availableProducts.length
      });
    }

    // Rastrear visualização individual de produtos quando entram na viewport
    // Otimizado: threshold menor para detectar mais cedo, rootMargin para pré-carregar
    const productObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const productId = card.querySelector(".btn-ver-produto")?.dataset.productId;
            const productName = card.querySelector(".btn-ver-produto")?.dataset.productName;

            if (productId && !card.dataset.tracked) {
              card.dataset.tracked = "true";

              if (typeof window.fbq !== "undefined") {
                window.fbq("track", "ViewContent", {
                  content_name: productName,
                  content_ids: [productId],
                  content_type: "product",
                  content_category: "Equipamentos Veterinários"
                });
              }
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    // Observar cada card
    productsGrid.querySelectorAll(".product-card").forEach((card) => {
      productObserver.observe(card);
    });

    // Rastrear cliques nos botões "Ver Produto"
    productsGrid.querySelectorAll(".btn-ver-produto").forEach((button) => {
      button.addEventListener("click", (event) => {
        const productId = button.dataset.productId;
        const productName = button.dataset.productName;

        if (typeof window.fbq !== "undefined") {
          window.fbq("track", "Lead", {
            content_name: productName,
            content_ids: [productId],
            content_type: "product",
            content_category: "Equipamentos Veterinários"
          });

          window.fbq("track", "InitiateCheckout", {
            content_name: productName,
            content_ids: [productId],
            content_type: "product"
          });
        }
      });
    });
  } catch (error) {
    if (productsGrid) {
      productsGrid.innerHTML = `
        <div class="products-error" role="alert">
          <p>Erro ao carregar produtos. Por favor, recarregue a página.</p>
        </div>
      `;
    }
  }
}

// Carregar e renderizar acessórios
async function loadAccessories() {
  try {
    const response = await fetch("/data/accessories.json");
    if (!response.ok) {
      throw new Error("Falha ao carregar acessórios");
    }

    const accessories = await response.json();
    const availableAccessories = accessories.filter((a) => a.available);

    const accessoriesGrid = document.querySelector("#accessories-grid");

    if (!accessoriesGrid) {
      return;
    }

    if (availableAccessories.length === 0) {
      accessoriesGrid.innerHTML = `
        <div class="products-empty" role="alert">
          <p>Acessórios temporariamente indisponíveis.</p>
        </div>
      `;
      return;
    }

    // Limpar grid
    accessoriesGrid.innerHTML = "";

    // Renderizar acessórios de forma otimizada (batch rendering)
    const initialBatchSize = 6;
    const batchSize = 4;
    
    // Renderizar primeiro batch imediatamente
    const initialAccessories = availableAccessories.slice(0, initialBatchSize);
    initialAccessories.forEach((accessory, index) => {
      const card = createProductCard(accessory, true, index);
      accessoriesGrid.appendChild(card);
    });

    // Renderizar resto progressivamente
    const remainingAccessories = availableAccessories.slice(initialBatchSize);
    let currentIndex = 0;

    function renderNextBatch() {
      const batch = remainingAccessories.slice(currentIndex, currentIndex + batchSize);
      batch.forEach((accessory, batchIndex) => {
        const globalIndex = initialBatchSize + currentIndex + batchIndex;
        const card = createProductCard(accessory, true, globalIndex);
        accessoriesGrid.appendChild(card);
      });
      currentIndex += batchSize;

      if (currentIndex < remainingAccessories.length) {
        if (window.requestIdleCallback) {
          window.requestIdleCallback(renderNextBatch, { timeout: 100 });
        } else {
          setTimeout(renderNextBatch, 0);
        }
      }
    }

    if (remainingAccessories.length > 0) {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(renderNextBatch, { timeout: 100 });
      } else {
        requestAnimationFrame(() => {
          setTimeout(renderNextBatch, 0);
        });
      }
    }

    // Meta Pixel: Rastrear visualização de acessórios
    if (typeof window.fbq !== "undefined") {
      window.fbq("track", "ViewContent", {
        content_name: "Black Days RZ VET - Acessórios",
        content_category: "Acessórios Veterinários",
        content_type: "product",
        content_ids: availableAccessories.map((a) => a.id),
        num_items: availableAccessories.length
      });
    }

    // Rastrear visualização individual de acessórios quando entram na viewport
    // Otimizado: threshold menor para detectar mais cedo, rootMargin para pré-carregar
    const accessoryObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const accessoryId = card.querySelector(".btn-ver-produto")?.dataset.productId;
            const accessoryName = card.querySelector(".btn-ver-produto")?.dataset.productName;

            if (accessoryId && !card.dataset.tracked) {
              card.dataset.tracked = "true";

              if (typeof window.fbq !== "undefined") {
                window.fbq("track", "ViewContent", {
                  content_name: accessoryName,
                  content_ids: [accessoryId],
                  content_type: "product",
                  content_category: "Acessórios Veterinários"
                });
              }
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    // Observar cada card
    accessoriesGrid.querySelectorAll(".product-card").forEach((card) => {
      accessoryObserver.observe(card);
    });

    // Rastrear cliques nos botões "Ver Produto" dos acessórios
    accessoriesGrid.querySelectorAll(".btn-ver-produto").forEach((button) => {
      button.addEventListener("click", (event) => {
        const accessoryId = button.dataset.productId;
        const accessoryName = button.dataset.productName;

        if (typeof window.fbq !== "undefined") {
          window.fbq("track", "Lead", {
            content_name: accessoryName,
            content_ids: [accessoryId],
            content_type: "product",
            content_category: "Acessórios Veterinários"
          });

          window.fbq("track", "InitiateCheckout", {
            content_name: accessoryName,
            content_ids: [accessoryId],
            content_type: "product"
          });
        }
      });
    });
  } catch (error) {
    const accessoriesGrid = document.querySelector("#accessories-grid");
    if (accessoriesGrid) {
      accessoriesGrid.innerHTML = `
        <div class="products-error" role="alert">
          <p>Erro ao carregar acessórios. Por favor, recarregue a página.</p>
        </div>
      `;
    }
  }
}

// ===== HERO CAROUSEL =====
let carouselState = {
  currentSlide: 0,
  slides: [],
  autoplayInterval: null,
  autoplayDelay: 5000
};

// Carregar e renderizar banners hero
async function loadHeroBanners(retryCount = 0) {
  const maxRetries = 3;
  const retryDelay = 1000; // 1 segundo
  
  try {
    const response = await fetch("/data/banners.json", {
      cache: "no-cache", // Evitar cache problemático
      headers: {
        "Cache-Control": "no-cache"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Falha ao carregar banners: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const activeBanners = data.heroBanners.filter((b) => b.active).sort((a, b) => a.order - b.order);

    if (activeBanners.length === 0) {
      console.warn("[Banners] Nenhum banner ativo encontrado");
      showBannerFallback();
      return;
    }

    carouselState.slides = activeBanners;
    renderHeroCarousel(activeBanners);
    initCarousel();
  } catch (error) {
    console.error("[Banners] Erro ao carregar banners:", error);
    
    // Tentar novamente se ainda houver tentativas
    if (retryCount < maxRetries) {
      console.log(`[Banners] Tentando novamente (${retryCount + 1}/${maxRetries})...`);
      setTimeout(() => {
        loadHeroBanners(retryCount + 1);
      }, retryDelay * (retryCount + 1)); // Backoff exponencial
    } else {
      // Se todas as tentativas falharam, mostrar fallback
      console.error("[Banners] Todas as tentativas falharam. Mostrando fallback.");
      showBannerFallback();
    }
  }
}

// Função para mostrar fallback visual se banners não carregarem
function showBannerFallback() {
  const slidesContainer = document.querySelector(".hero-carousel__slides");
  if (!slidesContainer) return;
  
  // Verificar se já há conteúdo (não sobrescrever se já carregou)
  if (slidesContainer.children.length > 0) return;
  
  slidesContainer.innerHTML = `
    <div class="hero-carousel__slide hero-carousel__slide--active" role="listitem">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 2rem;">
        <div style="text-align: center;">
          <h2 style="margin: 0 0 1rem 0; font-size: 1.5rem;">Black Days RZ VET 2025</h2>
          <p style="margin: 0; font-size: 1rem; opacity: 0.9;">As melhores promoções em equipamentos veterinários</p>
        </div>
      </div>
    </div>
  `;
}

// Renderizar carrossel hero
function renderHeroCarousel(banners) {
  const slidesContainer = document.querySelector(".hero-carousel__slides");
  const indicatorsContainer = document.querySelector(".hero-carousel__indicators");

  if (!slidesContainer || !indicatorsContainer) {
    return;
  }

  // Limpar containers
  slidesContainer.innerHTML = "";
  indicatorsContainer.innerHTML = "";

  // Renderizar slides
  banners.forEach((banner, index) => {
    const slide = document.createElement("div");
    slide.className = `hero-carousel__slide ${index === 0 ? "hero-carousel__slide--active" : ""}`;
    slide.setAttribute("role", "listitem");
    slide.setAttribute("aria-hidden", index !== 0 ? "true" : "false");
    slide.dataset.slideIndex = index;

    const link = banner.link ? `<a href="${banner.link}" class="hero-carousel__slide-link">` : "";
    const linkClose = banner.link ? "</a>" : "";

    // Detectar tamanho da tela e usar imagem correta (usar função auxiliar)
    const imageDesktop = banner.imageDesktop || banner.image;
    const imageMobile = banner.imageMobile || banner.image;
    const isMobile = isMobileDevice(); // Usar função auxiliar mais confiável
    const imageSrc = isMobile ? imageMobile : imageDesktop;
    
    // Garantir que nunca use desktop no mobile
    if (isMobile && !imageMobile) {
      console.warn(`[Banners] Banner ${banner.id} não tem imagem mobile, usando desktop como fallback`);
    }
    
    slide.innerHTML = `
      ${link}
        <img 
          src="${imageSrc}" 
          alt="${banner.alt}" 
          class="hero-carousel__slide-image"
          data-desktop="${imageDesktop}"
          data-mobile="${imageMobile}"
          loading="${index === 0 ? "eager" : "lazy"}"
          decoding="async"
          fetchpriority="${index === 0 ? "high" : "auto"}"
        />
        <div class="hero-carousel__slide-placeholder" style="display: none;" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 9h6v6H9z" />
          </svg>
          <p>Banner ${index + 1}</p>
        </div>
      ${linkClose}
    `;

    // Adicionar tratamento de erro de imagem após inserir no DOM
    const imgElement = slide.querySelector(".hero-carousel__slide-image");
    if (imgElement) {
      imgElement.addEventListener("error", () => {
        const placeholder = slide.querySelector(".hero-carousel__slide-placeholder");
        if (placeholder) {
          imgElement.style.display = "none";
          placeholder.style.display = "flex";
        }
      });
      
      // Preload da próxima imagem para transição suave
      if (index === 0 && banners.length > 1) {
        const nextBanner = banners[1];
        const nextImageDesktop = nextBanner.imageDesktop || nextBanner.image;
        const nextImageMobile = nextBanner.imageMobile || nextBanner.image;
        const nextImageSrc = isMobileDevice() ? nextImageMobile : nextImageDesktop;
        if (nextImageSrc) {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.as = 'image';
          link.href = nextImageSrc;
          document.head.appendChild(link);
        }
      }
    }

    slidesContainer.appendChild(slide);

    // Renderizar indicador
    const indicator = document.createElement("button");
    indicator.className = `hero-carousel__indicator ${index === 0 ? "hero-carousel__indicator--active" : ""}`;
    indicator.setAttribute("type", "button");
    indicator.setAttribute("role", "tab");
    indicator.setAttribute("aria-label", `Ir para banner ${index + 1}`);
    indicator.setAttribute("aria-selected", index === 0 ? "true" : "false");
    indicator.dataset.slideIndex = index;
    indicator.addEventListener("click", () => goToSlide(index));

    indicatorsContainer.appendChild(indicator);
  });
}

// Inicializar carrossel
function initCarousel() {
  const prevButton = document.querySelector(".hero-carousel__prev");
  const nextButton = document.querySelector(".hero-carousel__next");
  const carousel = document.querySelector(".hero-carousel");

  if (!prevButton || !nextButton || !carousel) {
    return;
  }

  // Event listeners para botões
  prevButton.addEventListener("click", () => prevSlide());
  nextButton.addEventListener("click", () => nextSlide());

  // Pausar autoplay no hover
  carousel.addEventListener("mouseenter", () => stopAutoplay());
  carousel.addEventListener("mouseleave", () => startAutoplay());

  // Navegação por teclado
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  });

  // Touch/swipe para mobile
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  carousel.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Iniciar autoplay
  startAutoplay();
}

// Próximo slide
function nextSlide() {
  const nextIndex = (carouselState.currentSlide + 1) % carouselState.slides.length;
  goToSlide(nextIndex);
}

// Slide anterior
function prevSlide() {
  const prevIndex = carouselState.currentSlide === 0 
    ? carouselState.slides.length - 1 
    : carouselState.currentSlide - 1;
  goToSlide(prevIndex);
}

// Ir para slide específico
function goToSlide(index) {
  if (index < 0 || index >= carouselState.slides.length) return;

  const slides = document.querySelectorAll(".hero-carousel__slide");
  const indicators = document.querySelectorAll(".hero-carousel__indicator");

  // Remover classe active do slide atual
  slides[carouselState.currentSlide]?.classList.remove("hero-carousel__slide--active");
  slides[carouselState.currentSlide]?.setAttribute("aria-hidden", "true");
  indicators[carouselState.currentSlide]?.classList.remove("hero-carousel__indicator--active");
  indicators[carouselState.currentSlide]?.setAttribute("aria-selected", "false");

  // Adicionar classe active ao novo slide
  carouselState.currentSlide = index;
  slides[index]?.classList.add("hero-carousel__slide--active");
  slides[index]?.setAttribute("aria-hidden", "false");
  indicators[index]?.classList.add("hero-carousel__indicator--active");
  indicators[index]?.setAttribute("aria-selected", "true");

  // Reiniciar autoplay
  stopAutoplay();
  startAutoplay();
}

// Iniciar autoplay
function startAutoplay() {
  if (carouselState.autoplayInterval) {
    clearInterval(carouselState.autoplayInterval);
  }

  carouselState.autoplayInterval = setInterval(() => {
    nextSlide();
  }, carouselState.autoplayDelay);
}

// Parar autoplay
function stopAutoplay() {
  if (carouselState.autoplayInterval) {
    clearInterval(carouselState.autoplayInterval);
    carouselState.autoplayInterval = null;
  }
}

// Função para atualizar imagens dos banners ao redimensionar
function updateBannerImagesOnResize() {
  const bannerImages = document.querySelectorAll(".hero-carousel__slide-image");
  const isMobile = isMobileDevice(); // Usar função auxiliar mais confiável
  
  bannerImages.forEach((img) => {
    const desktopSrc = img.dataset.desktop;
    const mobileSrc = img.dataset.mobile;
    
    if (!desktopSrc || !mobileSrc) return;
    
    // CRÍTICO: Garantir que mobile sempre use mobile, desktop sempre use desktop
    const correctSrc = isMobile ? mobileSrc : desktopSrc;
    const currentSrc = img.getAttribute("src");
    
    // Só atualiza se a imagem atual não for a correta
    // E garantir que nunca troque mobile por desktop ou vice-versa incorretamente
    if (currentSrc !== correctSrc) {
      // Verificação adicional de segurança
      const isCurrentlyMobile = currentSrc === mobileSrc;
      const shouldBeMobile = isMobile;
      
      // Só atualizar se realmente precisar (evitar loops)
      if (isCurrentlyMobile !== shouldBeMobile || currentSrc !== correctSrc) {
        img.src = correctSrc;
      }
    }
  });
}

// Função de inicialização centralizada - Otimizada para performance
function initializeApp() {
  // Usar requestIdleCallback para inicializações não críticas
  const criticalInit = () => {
    initializeCountdowns();
    loadHeroBanners();
  };
  
  const nonCriticalInit = () => {
    loadProducts();
    loadAccessories();
  };
  
  // Inicializações críticas imediatamente
  criticalInit();
  
  // Inicializações não críticas quando o navegador estiver ocioso
  if (window.requestIdleCallback) {
    window.requestIdleCallback(nonCriticalInit, { timeout: 2000 });
  } else {
    // Fallback para navegadores sem suporte
    setTimeout(nonCriticalInit, 100);
  }
  
  // Listener para redimensionamento com debounce otimizado
  let resizeTimeout;
  let isResizing = false;
  window.addEventListener("resize", () => {
    if (!isResizing) {
      isResizing = true;
      requestAnimationFrame(() => {
        isResizing = false;
      });
    }
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateBannerImagesOnResize();
      // Invalidar cache de mobile device ao redimensionar
      mobileDeviceCache = null;
    }, 200);
  });
  
  // Listener adicional para mudança de orientação (importante para mobile)
  window.addEventListener("orientationchange", () => {
    mobileDeviceCache = null; // Invalidar cache
    setTimeout(() => {
      updateBannerImagesOnResize();
    }, 200);
  });
}

// Inicializar quando o DOM estiver pronto - Otimizado
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp, { once: true });
} else {
  // DOM já está pronto, mas aguardar um frame para garantir que tudo está renderizado
  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(initializeApp);
  } else {
    setTimeout(initializeApp, 0);
  }
}

