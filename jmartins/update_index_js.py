# -*- coding: utf-8 -*-
import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Substituir bloco do defaultSiteConfig e funções de whatsapp/simulador/vídeo
js_block_old = r'    \/\/ CONFIGURAÇÕES GLOBAIS DA EMPRESA & HERO.*?function closeVideoModal\(\) \{.*?\}'

js_block_new = """    // EQUIPE COMERCIAL WHATSAPP (8 LINHAS OFICIAIS)
    const WHATSAPP_TEAM = [
      { name: "Consultor Comercial 01", phone: "(19) 99816-7195", raw: "5519998167195", role: "Vendas Diretas & Cotações" },
      { name: "Consultor Comercial 02", phone: "(19) 99773-1046", raw: "5519997731046", role: "Vendas Diretas & Cotações" },
      { name: "Consultor Comercial 03", phone: "(19) 99364-8463", raw: "5519993648463", role: "Vendas Diretas & Cotações" },
      { name: "Consultor Comercial 04", phone: "(19) 98217-0196", raw: "5519982170196", role: "Vendas Diretas & Cotações" },
      { name: "Consultor Comercial 05", phone: "(19) 99674-9915", raw: "5519996749915", role: "Vendas Diretas & Cotações" },
      { name: "Consultor Comercial 06", phone: "(19) 98303-0302", raw: "5519983030302", role: "Vendas Diretas & Cotações" },
      { name: "Consultor Comercial 07", phone: "(19) 99177-0861", raw: "5519991770861", role: "Vendas Diretas & Cotações" },
      { name: "Consultor Comercial 08", phone: "(19) 99972-1997", raw: "5519999721997", role: "Vendas Diretas & Cotações" }
    ];

    let currentWhatsAppSubject = '';

    function openWhatsAppModal(subject = '') {
      currentWhatsAppSubject = subject;
      const modal = document.getElementById('whatsappModal');
      const subjEl = document.getElementById('whatsappModalSubject');
      if (subjEl) {
        subjEl.textContent = subject 
          ? `Cotação expressa: ${subject}. Selecione um dos 8 consultores abaixo:` 
          : 'Selecione um dos 8 consultores comerciais da JMartins para atendimento imediato:';
      }

      const grid = document.getElementById('whatsappConsultantsGrid');
      if (grid) {
        grid.innerHTML = WHATSAPP_TEAM.map((c, i) => `
          <div class="bg-brand-gray-950 border border-brand-gray-800 rounded-xl p-3.5 hover:border-emerald-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">${c.name}</span>
                <span class="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
                </span>
              </div>
              <div class="text-xs font-mono font-bold text-brand-gray-200 mt-1">${c.phone}</div>
              <div class="text-[11px] text-brand-gray-500">${c.role}</div>
            </div>
            <button onclick="startConsultantWhatsApp(${i})" class="mt-3 w-full py-1.5 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-emerald-500/30 cursor-pointer">
              <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
              <span>Iniciar Conversa</span>
            </button>
          </div>
        `).join('');
      }

      if (modal) modal.classList.remove('hidden');
      lucide.createIcons();
    }

    function closeWhatsAppModal() {
      const modal = document.getElementById('whatsappModal');
      if (modal) modal.classList.add('hidden');
    }

    function startConsultantWhatsApp(index) {
      const c = WHATSAPP_TEAM[index] || WHATSAPP_TEAM[0];
      const message = currentWhatsAppSubject 
        ? `Olá ${c.name}! Vim pelo site da JMartins Industrial e gostaria de cotação de: *${currentWhatsAppSubject}*. Poderia me passar preços e prazos?`
        : `Olá ${c.name}! Vim pelo site oficial da JMartins Industrial e gostaria de falar com você para uma cotação sob medida.`;
      window.open(`https://wa.me/${c.raw}?text=${encodeURIComponent(message)}`, '_blank');
      closeWhatsAppModal();
    }

    function startQuickWhatsApp() {
      const randomIdx = Math.floor(Math.random() * WHATSAPP_TEAM.length);
      startConsultantWhatsApp(randomIdx);
    }

    // CONFIGURAÇÕES GLOBAIS DA EMPRESA & HERO
    const defaultSiteConfig = {
      whatsappNumber: '5519998167195',
      phone: '(19) 3672-2881 / (19) 3672-1563',
      email: 'contato@jmartins.ind.br',
      instagram: '@jmartinsindustrial',
      address: 'Sul de Minas, São Paulo e Litoral Norte de SC • Entregas em todo o Brasil',
      heroBadge: 'Fornecimento Industrial Direto • Entregas em Todo o Brasil',
      heroTitle1: 'POTÊNCIA E PRECISÃO EM',
      heroTitle2: 'AÇO PLANO E TELHAS',
      heroTitle3: 'SOLUÇÕES SOB MEDIDA',
      heroSubtitle: 'Corte e dobra, telhas galvalume e termoacústicas, bobinas, chapas, vigas, perfis, painéis, calhas, tubos e slitter. Polos no Sul de Minas, São Paulo e Litoral Norte de Santa Catarina com atendimento em todo o Brasil.',
      heroCta: 'SOLICITAR COTAÇÃO RÁPIDA',
      videoType: 'mp4',
      videoUrl: 'assets/video_institucional.mp4'
    };

    function getSiteConfig() {
      const stored = localStorage.getItem('jmartins_site_config');
      if (stored) {
        try {
          return { ...defaultSiteConfig, ...JSON.parse(stored) };
        } catch(e) {
          return defaultSiteConfig;
        }
      }
      return defaultSiteConfig;
    }

    async function loadSiteConfigFromAPI() {
      try {
        const resp = await fetch('/api/config');
        if (resp.ok) {
          const data = await resp.json();
          if (data.config && Object.keys(data.config).length > 0) {
            localStorage.setItem('jmartins_site_config', JSON.stringify(data.config));
            applySiteConfig(data.config);
            return;
          }
        }
      } catch (err) {
        console.warn('API config fetch failed:', err);
      }
      applySiteConfig();
    }

    function applySiteConfig(cfg) {
      if (!cfg) cfg = getSiteConfig();

      const rawWa = (cfg.whatsappNumber || '5519998167195').replace(/\D/g, '');
      const igClean = (cfg.instagram || '@jmartinsindustrial').replace(/^@/, '').trim();

      // 1. WhatsApp nos botões
      const headerWa = document.getElementById('headerWhatsappBtn');
      if (headerWa) {
        headerWa.onclick = () => openWhatsAppModal();
      }
      const floatWa = document.getElementById('floatingWhatsappBtn');
      if (floatWa) {
        floatWa.onclick = () => openWhatsAppModal();
      }
      const footerWa = document.getElementById('footerWhatsappLink');
      const footerWaText = document.getElementById('footerWhatsappText');
      if (footerWa) footerWa.href = `https://wa.me/${rawWa}`;
      if (footerWaText) footerWaText.textContent = cfg.phone ? `${cfg.phone} (WhatsApp: ${cfg.whatsappNumber})` : cfg.whatsappNumber;

      // 2. Telefones fixos
      const footerPhone = document.getElementById('footerPhoneLink');
      const footerPhoneText = document.getElementById('footerPhoneText');
      if (footerPhone) footerPhone.href = `tel:1936722881`;
      if (footerPhoneText) footerPhoneText.textContent = '(19) 3672-2881 / (19) 3672-1563';

      // 3. E-mail
      const footerEmail = document.getElementById('footerEmailLink');
      const footerEmailText = document.getElementById('footerEmailText');
      if (footerEmail) footerEmail.href = `mailto:${cfg.email || 'contato@jmartins.ind.br'}`;
      if (footerEmailText) footerEmailText.textContent = cfg.email || 'contato@jmartins.ind.br';

      // 4. Instagram
      const topIg = document.getElementById('topbarInstagram');
      const topIgText = document.getElementById('topbarInstagramText');
      if (topIg) topIg.href = `https://instagram.com/${igClean}`;
      if (topIgText) topIgText.textContent = `@${igClean}`;

      const footIg = document.getElementById('footerInstagramLink');
      const footIgText = document.getElementById('footerInstagramText');
      const footSocialIg = document.getElementById('footerSocialInstagram');
      if (footIg) footIg.href = `https://instagram.com/${igClean}`;
      if (footIgText) footIgText.textContent = `@${igClean}`;
      if (footSocialIg) footSocialIg.href = `https://instagram.com/${igClean}`;

      // 5. Endereço / Regiões
      const topAddr = document.getElementById('topbarAddress');
      if (topAddr) {
        topAddr.innerHTML = `<i data-lucide="map-pin" class="w-3.5 h-3.5 text-brand-red shrink-0"></i> Polos: <strong>Sul de Minas</strong> • <strong>São Paulo</strong> • <strong>Litoral Norte de SC</strong>`;
      }
      const footAddr = document.getElementById('footerAddressText');
      if (footAddr) footAddr.textContent = cfg.address;

      // 6. Textos do Hero
      const heroBadge = document.getElementById('cfgHeroBadge');
      if (heroBadge) heroBadge.textContent = cfg.heroBadge;

      const heroT1 = document.getElementById('cfgHeroTitle1');
      if (heroT1) heroT1.textContent = cfg.heroTitle1;

      const heroT2 = document.getElementById('cfgHeroTitle2');
      if (heroT2) heroT2.textContent = cfg.heroTitle2;

      const heroT3 = document.getElementById('cfgHeroTitle3');
      if (heroT3) heroT3.textContent = cfg.heroTitle3;

      const heroSub = document.getElementById('cfgHeroSubtitle');
      if (heroSub) heroSub.textContent = cfg.heroSubtitle;

      const heroCta = document.getElementById('cfgHeroCtaText');
      if (heroCta) heroCta.textContent = cfg.heroCta;

      lucide.createIcons();
    }

    function populateCompanyForm() {
      const cfg = getSiteConfig();
      if (document.getElementById('cfgInputWhatsapp')) document.getElementById('cfgInputWhatsapp').value = cfg.whatsappNumber || '';
      if (document.getElementById('cfgInputPhone')) document.getElementById('cfgInputPhone').value = cfg.phone || '';
      if (document.getElementById('cfgInputEmail')) document.getElementById('cfgInputEmail').value = cfg.email || '';
      if (document.getElementById('cfgInputInstagram')) document.getElementById('cfgInputInstagram').value = cfg.instagram || '';
      if (document.getElementById('cfgInputAddress')) document.getElementById('cfgInputAddress').value = cfg.address || '';
      if (document.getElementById('cfgInputHeroBadge')) document.getElementById('cfgInputHeroBadge').value = cfg.heroBadge || '';
      if (document.getElementById('cfgInputHeroTitle1')) document.getElementById('cfgInputHeroTitle1').value = cfg.heroTitle1 || '';
      if (document.getElementById('cfgInputHeroTitle2')) document.getElementById('cfgInputHeroTitle2').value = cfg.heroTitle2 || '';
      if (document.getElementById('cfgInputHeroTitle3')) document.getElementById('cfgInputHeroTitle3').value = cfg.heroTitle3 || '';
      if (document.getElementById('cfgInputHeroSubtitle')) document.getElementById('cfgInputHeroSubtitle').value = cfg.heroSubtitle || '';
      if (document.getElementById('cfgInputHeroCta')) document.getElementById('cfgInputHeroCta').value = cfg.heroCta || '';
      if (document.getElementById('cfgInputVideoType')) document.getElementById('cfgInputVideoType').value = cfg.videoType || 'mp4';
      if (document.getElementById('cfgInputVideoUrl')) document.getElementById('cfgInputVideoUrl').value = cfg.videoUrl || 'assets/video_institucional.mp4';
    }

    async function saveCompanyConfig() {
      const cfg = {
        whatsappNumber: (document.getElementById('cfgInputWhatsapp').value || '5519998167195').trim(),
        phone: (document.getElementById('cfgInputPhone').value || '(19) 3672-2881 / (19) 3672-1563').trim(),
        email: (document.getElementById('cfgInputEmail').value || 'contato@jmartins.ind.br').trim(),
        instagram: (document.getElementById('cfgInputInstagram').value || '@jmartinsindustrial').trim(),
        address: (document.getElementById('cfgInputAddress').value || 'Sul de Minas, São Paulo e Litoral Norte de SC • Entregas em todo o Brasil').trim(),
        heroBadge: (document.getElementById('cfgInputHeroBadge').value || 'Fornecimento Industrial Direto • Entregas em Todo o Brasil').trim(),
        heroTitle1: (document.getElementById('cfgInputHeroTitle1').value || 'POTÊNCIA E PRECISÃO EM').trim(),
        heroTitle2: (document.getElementById('cfgInputHeroTitle2').value || 'AÇO PLANO E TELHAS').trim(),
        heroTitle3: (document.getElementById('cfgInputHeroTitle3').value || 'SOLUÇÕES SOB MEDIDA').trim(),
        heroSubtitle: (document.getElementById('cfgInputHeroSubtitle').value || '').trim(),
        heroCta: (document.getElementById('cfgInputHeroCta').value || 'SOLICITAR COTAÇÃO RÁPIDA').trim(),
        videoType: document.getElementById('cfgInputVideoType').value,
        videoUrl: (document.getElementById('cfgInputVideoUrl').value || 'assets/video_institucional.mp4').trim()
      };

      const token = getAuthToken();
      if (!token) {
        alert('Sua sessão expirou. Faça login novamente.');
        closeAdminModal();
        openAdminLoginModal();
        return;
      }

      try {
        const resp = await fetch('/api/config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ config: cfg })
        });
        const data = await resp.json();

        if (resp.ok && data.ok) {
          localStorage.setItem('jmartins_site_config', JSON.stringify(cfg));
          applySiteConfig(cfg);
          alert('Configurações salvas no Banco de Dados SQLite com sucesso! As alterações já estão públicas para todos os visitantes.');
          drawStudioCard();
          return;
        } else {
          alert('Erro ao salvar no banco: ' + (data.error || 'Acesso negado'));
        }
      } catch (err) {
        localStorage.setItem('jmartins_site_config', JSON.stringify(cfg));
        applySiteConfig(cfg);
        alert('Salvo no cache do navegador. Servidor indisponível.');
        drawStudioCard();
      }
    }

    function resetCompanyConfig() {
      if (!confirm('Deseja realmente restaurar todos os dados e textos originais da empresa e da seção hero?')) return;
      localStorage.removeItem('jmartins_site_config');
      populateCompanyForm();
      applySiteConfig(defaultSiteConfig);
      alert('Configurações restauradas para os padrões originais com sucesso.');
      drawStudioCard();
    }

    function openWhatsAppDirect(e) {
      if (e) e.preventDefault();
      openWhatsAppModal();
    }

    // SIMULADOR DE COTAÇÃO
    function calculateQuote() {
      const length = parseFloat(document.getElementById('simLength').value) || 0;
      const qty = parseInt(document.getElementById('simQuantity').value) || 0;
      
      const totalLinear = (length * qty).toFixed(1);
      // Largura útil típica de telha TP40 é ~0.98m a 1.0m
      const totalArea = Math.round(length * qty * 0.98);

      document.getElementById('resLinear').textContent = `${totalLinear} metros`;
      document.getElementById('resArea').textContent = `~ ${totalArea} m²`;
    }

    function sendSimulatedQuoteWhatsApp() {
      const product = document.getElementById('simProduct').value;
      const length = document.getElementById('simLength').value;
      const qty = document.getElementById('simQuantity').value;
      const location = document.getElementById('simLocation').value;
      const totalLinear = document.getElementById('resLinear').textContent;
      const totalArea = document.getElementById('resArea').textContent;

      const summary = `${product} (${qty} unid x ${length}m = ${totalLinear}, Destino: ${location})`;
      openWhatsAppModal(summary);
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }

    function quoteProduct(productName) {
      openWhatsAppModal(productName);
    }

    // MODAL VÍDEO
    function openVideoModal() {
      const player = document.getElementById('instVideoPlayer');
      const videoModal = document.getElementById('videoModal');

      if (player) {
        player.src = 'assets/video_institucional.mp4';
        player.load();
        player.play().catch(e => console.log('Autoplay status:', e));
      }

      if (videoModal) videoModal.classList.remove('hidden');
      lucide.createIcons();
    }

    function closeVideoModal() {
      const player = document.getElementById('instVideoPlayer');
      if (player) player.pause();
      const videoModal = document.getElementById('videoModal');
      if (videoModal) videoModal.classList.add('hidden');
    }"""

html = re.sub(js_block_old, lambda m: js_block_new, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("PART_2_JS_COMPLETED")
