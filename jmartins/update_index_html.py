# -*- coding: utf-8 -*-
import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. NOVO CATÁLOGO DE 13 PRODUTOS
produtos_section_new = """  <!-- SEÇÃO DE PRODUTOS PRINCIPAIS (13 PRODUTOS OFICIAIS) -->
  <section id="produtos" class="py-24 bg-brand-gray-900 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Cabeçalho da Seção -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-brand-red font-bold text-xs uppercase tracking-widest bg-brand-red/10 px-3 py-1 rounded-full border border-brand-red/20">
          Catálogo Industrial Completo
        </span>
        <h2 class="font-barlow font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-3 mb-4">
          Aço Plano, Telhas e Perfis Estruturais
        </h2>
        <p class="text-brand-gray-400 text-sm sm:text-base">
          Fornecimento direto de fábrica com corte sob medida, rigoroso padrão de espessura e conformidade técnica para obras e indústrias em todo o Brasil.
        </p>
      </div>

      <!-- Grid com os 13 Produtos Oficiais -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        <!-- PRODUTO 1: CORTE E DOBRA -->
        <div class="bg-brand-gray-950 border border-brand-gray-800 rounded-2xl overflow-hidden hover:border-brand-red/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl flex flex-col">
          <div class="relative h-44 overflow-hidden bg-brand-gray-900">
            <img src="assets/hero_steel.jpg" alt="Corte e Dobra sob Medida" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75">
            <div class="absolute inset-0 bg-gradient-to-t from-brand-gray-950 via-brand-gray-950/40 to-transparent"></div>
            <span class="absolute top-3 left-3 bg-brand-red text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow">
              Sob Medida
            </span>
          </div>
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 text-brand-red mb-1">
                <i data-lucide="scissors" class="w-4 h-4"></i>
                <span class="text-[11px] font-bold uppercase tracking-wider text-brand-gray-400">Conformação CNC</span>
              </div>
              <h3 class="font-barlow font-bold text-xl text-white uppercase group-hover:text-brand-red transition-colors">
                Corte e Dobra
              </h3>
              <p class="text-brand-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Conformação precisa em guilhotinas e dobradeiras CNC de alta capacidade. Peças sob medida prontas para montagem sem perda de material.
              </p>
            </div>
            <button onclick="openWhatsAppModal('Corte e dobra')" class="mt-5 w-full py-2.5 px-3 rounded-lg bg-brand-gray-900 hover:bg-brand-red text-white text-xs font-bold uppercase tracking-wider transition-colors border border-brand-gray-800 hover:border-brand-red flex items-center justify-center gap-2">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              <span>Cotar Corte e Dobra</span>
            </button>
          </div>
        </div>

        <!-- PRODUTO 2: TELHAS -->
        <div class="bg-brand-gray-950 border border-brand-gray-800 rounded-2xl overflow-hidden hover:border-brand-red/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl flex flex-col">
          <div class="relative h-44 overflow-hidden bg-brand-gray-900">
            <img src="assets/telhas_trapezoidais.jpg" alt="Telhas Galvanizadas e Galvalume" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80">
            <div class="absolute inset-0 bg-gradient-to-t from-brand-gray-950 via-brand-gray-950/40 to-transparent"></div>
            <span class="absolute top-3 left-3 bg-brand-gray-900 border border-brand-gray-700 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
              TP40 / TP25 / Ondulada
            </span>
          </div>
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 text-brand-red mb-1">
                <i data-lucide="home" class="w-4 h-4"></i>
                <span class="text-[11px] font-bold uppercase tracking-wider text-brand-gray-400">Cobertura & Fechamento</span>
              </div>
              <h3 class="font-barlow font-bold text-xl text-white uppercase group-hover:text-brand-red transition-colors">
                Telhas
              </h3>
              <p class="text-brand-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Telhas trapezoidais e onduladas conformadas em aço Galvalume e galvanizado. Alta rigidez mecânica e máxima vazão de água para galpões e estruturas.
              </p>
            </div>
            <button onclick="openWhatsAppModal('Telhas (TP40, TP25 e Onduladas)')" class="mt-5 w-full py-2.5 px-3 rounded-lg bg-brand-gray-900 hover:bg-brand-red text-white text-xs font-bold uppercase tracking-wider transition-colors border border-brand-gray-800 hover:border-brand-red flex items-center justify-center gap-2">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              <span>Cotar Telhas</span>
            </button>
          </div>
        </div>

        <!-- PRODUTO 3: TELHAS TERMOACÚSTICAS -->
        <div class="bg-brand-gray-950 border border-brand-gray-800 rounded-2xl overflow-hidden hover:border-brand-red/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl flex flex-col">
          <div class="relative h-44 overflow-hidden bg-brand-gray-900">
            <img src="assets/telhas_trapezoidais.jpg" alt="Telhas Termoacústicas Sanduíche" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80">
            <div class="absolute inset-0 bg-gradient-to-t from-brand-gray-950 via-brand-gray-950/40 to-transparent"></div>
            <span class="absolute top-3 left-3 bg-brand-red text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow">
              Sanduíche EPS / PIR
            </span>
          </div>
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 text-brand-red mb-1">
                <i data-lucide="thermometer-snowflake" class="w-4 h-4"></i>
                <span class="text-[11px] font-bold uppercase tracking-wider text-brand-gray-400">Isolamento Térmico</span>
              </div>
              <h3 class="font-barlow font-bold text-xl text-white uppercase group-hover:text-brand-red transition-colors">
                Telhas Termoacústicas
              </h3>
              <p class="text-brand-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Duas camadas de aço com núcleo isolante em EPS antichama ou PIR. Reduz até 90% do calor e ruídos de chuva, proporcionando conforto e economia.
              </p>
            </div>
            <button onclick="openWhatsAppModal('Telhas Termoacústicas (Sanduíche)')" class="mt-5 w-full py-2.5 px-3 rounded-lg bg-brand-gray-900 hover:bg-brand-red text-white text-xs font-bold uppercase tracking-wider transition-colors border border-brand-gray-800 hover:border-brand-red flex items-center justify-center gap-2">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              <span>Cotar Telha Sanduíche</span>
            </button>
          </div>
        </div>

        <!-- PRODUTO 4: BOBINAS GALVALUME -->
        <div class="bg-brand-gray-950 border border-brand-gray-800 rounded-2xl overflow-hidden hover:border-brand-red/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl flex flex-col">
          <div class="relative h-44 overflow-hidden bg-brand-gray-900">
            <img src="assets/bobinas_aco.jpg" alt="Bobinas Galvalume JMARTINS" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80">
            <div class="absolute inset-0 bg-gradient-to-t from-brand-gray-950 via-brand-gray-950/40 to-transparent"></div>
            <span class="absolute top-3 left-3 bg-brand-red text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow">
              Aluzinc AZ150
            </span>
          </div>
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 text-brand-red mb-1">
                <i data-lucide="layers" class="w-4 h-4"></i>
                <span class="text-[11px] font-bold uppercase tracking-wider text-brand-gray-400">Liga 55% Al / 43,5% Zn</span>
              </div>
              <h3 class="font-barlow font-bold text-xl text-white uppercase group-hover:text-brand-red transition-colors">
                Bobinas Galvalume
              </h3>
              <p class="text-brand-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Durabilidade até 4 vezes superior ao aço galvanizado tradicional em intempéries externas. Espessuras de 0,35 a 1,20 mm para pronta-entrega.
              </p>
            </div>
            <button onclick="openWhatsAppModal('Bobinas Galvalume')" class="mt-5 w-full py-2.5 px-3 rounded-lg bg-brand-gray-900 hover:bg-brand-red text-white text-xs font-bold uppercase tracking-wider transition-colors border border-brand-gray-800 hover:border-brand-red flex items-center justify-center gap-2">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              <span>Cotar Bobina Galvalume</span>
            </button>
          </div>
        </div>

        <!-- PRODUTO 5: BOBINAS GALVANIZADAS -->
        <div class="bg-brand-gray-950 border border-brand-gray-800 rounded-2xl overflow-hidden hover:border-brand-red/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl flex flex-col">
          <div class="relative h-44 overflow-hidden bg-brand-gray-900">
            <img src="assets/bobinas_aco.jpg" alt="Bobinas Galvanizadas JMARTINS" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80">
            <div class="absolute inset-0 bg-gradient-to-t from-brand-gray-950 via-brand-gray-950/40 to-transparent"></div>
            <span class="absolute top-3 left-3 bg-brand-gray-900 border border-brand-gray-700 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
              Zinco Homogêneo
            </span>
          </div>
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 text-brand-red mb-1">
                <i data-lucide="shield" class="w-4 h-4"></i>
                <span class="text-[11px] font-bold uppercase tracking-wider text-brand-gray-400">Proteção Anticorrosão</span>
              </div>
              <h3 class="font-barlow font-bold text-xl text-white uppercase group-hover:text-brand-red transition-colors">
                Bobinas Galvanizadas
              </h3>
              <p class="text-brand-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Revestimento uniforme de zinco com alta ductilidade. Excelente conformabilidade para fabricação contínua de calhas, dutos e telhados.
              </p>
            </div>
            <button onclick="openWhatsAppModal('Bobinas Galvanizadas')" class="mt-5 w-full py-2.5 px-3 rounded-lg bg-brand-gray-900 hover:bg-brand-red text-white text-xs font-bold uppercase tracking-wider transition-colors border border-brand-gray-800 hover:border-brand-red flex items-center justify-center gap-2">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              <span>Cotar Bobina Galvanizada</span>
            </button>
          </div>
        </div>

        <!-- PRODUTO 6: BOBINAS PRÉ-PINTADAS -->
        <div class="bg-brand-gray-950 border border-brand-gray-800 rounded-2xl overflow-hidden hover:border-brand-red/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl flex flex-col">
          <div class="relative h-44 overflow-hidden bg-brand-gray-900">
            <img src="assets/hero_steel.jpg" alt="Bobinas Pré-pintadas" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75">
            <div class="absolute inset-0 bg-gradient-to-t from-brand-gray-950 via-brand-gray-950/40 to-transparent"></div>
            <span class="absolute top-3 left-3 bg-brand-red text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow">
              Cores Padrão
            </span>
          </div>
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 text-brand-red mb-1">
                <i data-lucide="palette" class="w-4 h-4"></i>
                <span class="text-[11px] font-bold uppercase tracking-wider text-brand-gray-400">Pintura Poliéster</span>
              </div>
              <h3 class="font-barlow font-bold text-xl text-white uppercase group-hover:text-brand-red transition-colors">
                Bobinas Pré-pintadas
              </h3>
              <p class="text-brand-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Aço com primer epóxi e acabamento contínuo em poliéster. Alta resistência UV e estética sofisticada para fachadas e coberturas modernas.
              </p>
            </div>
            <button onclick="openWhatsAppModal('Bobinas Pré-pintadas')" class="mt-5 w-full py-2.5 px-3 rounded-lg bg-brand-gray-900 hover:bg-brand-red text-white text-xs font-bold uppercase tracking-wider transition-colors border border-brand-gray-800 hover:border-brand-red flex items-center justify-center gap-2">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              <span>Cotar Bobina Pré-pintada</span>
            </button>
          </div>
        </div>

        <!-- PRODUTO 7: CHAPAS -->
        <div class="bg-brand-gray-950 border border-brand-gray-800 rounded-2xl overflow-hidden hover:border-brand-red/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl flex flex-col">
          <div class="relative h-44 overflow-hidden bg-brand-gray-900">
            <img src="assets/bobinas_aco.jpg" alt="Chapas de Aço" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70">
            <div class="absolute inset-0 bg-gradient-to-t from-brand-gray-950 via-brand-gray-950/40 to-transparent"></div>
            <span class="absolute top-3 left-3 bg-brand-gray-900 border border-brand-gray-700 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
              Laminadas & Xadrez
            </span>
          </div>
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 text-brand-red mb-1">
                <i data-lucide="square" class="w-4 h-4"></i>
                <span class="text-[11px] font-bold uppercase tracking-wider text-brand-gray-400">Aço Plano</span>
              </div>
              <h3 class="font-barlow font-bold text-xl text-white uppercase group-hover:text-brand-red transition-colors">
                Chapas
              </h3>
              <p class="text-brand-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Chapas finas a quente, finas a frio, galvanizadas e chapas xadrez antiderrapantes para pisos industriais, mezaninos e caldeiraria.
              </p>
            </div>
            <button onclick="openWhatsAppModal('Chapas de Aço')" class="mt-5 w-full py-2.5 px-3 rounded-lg bg-brand-gray-900 hover:bg-brand-red text-white text-xs font-bold uppercase tracking-wider transition-colors border border-brand-gray-800 hover:border-brand-red flex items-center justify-center gap-2">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              <span>Cotar Chapas</span>
            </button>
          </div>
        </div>

        <!-- PRODUTO 8: VIGAS -->
        <div class="bg-brand-gray-950 border border-brand-gray-800 rounded-2xl overflow-hidden hover:border-brand-red/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl flex flex-col">
          <div class="relative h-44 overflow-hidden bg-brand-gray-900">
            <img src="assets/hero_steel.jpg" alt="Vigas Estruturais" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75">
            <div class="absolute inset-0 bg-gradient-to-t from-brand-gray-950 via-brand-gray-950/40 to-transparent"></div>
            <span class="absolute top-3 left-3 bg-brand-red text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow">
              Padrões W, I e U
            </span>
          </div>
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 text-brand-red mb-1">
                <i data-lucide="git-commit" class="w-4 h-4"></i>
                <span class="text-[11px] font-bold uppercase tracking-wider text-brand-gray-400">Estrutural Pesado</span>
              </div>
              <h3 class="font-barlow font-bold text-xl text-white uppercase group-hover:text-brand-red transition-colors">
                Vigas
              </h3>
              <p class="text-brand-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Vigas estruturais laminadas e soldadas para suporte de grandes vãos livres em galpões industriais, edifícios comerciais e pontes rolantes.
              </p>
            </div>
            <button onclick="openWhatsAppModal('Vigas Estruturais')" class="mt-5 w-full py-2.5 px-3 rounded-lg bg-brand-gray-900 hover:bg-brand-red text-white text-xs font-bold uppercase tracking-wider transition-colors border border-brand-gray-800 hover:border-brand-red flex items-center justify-center gap-2">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              <span>Cotar Vigas</span>
            </button>
          </div>
        </div>

        <!-- PRODUTO 9: PERFIS DOBRADOS -->
        <div class="bg-brand-gray-950 border border-brand-gray-800 rounded-2xl overflow-hidden hover:border-brand-red/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl flex flex-col">
          <div class="relative h-44 overflow-hidden bg-brand-gray-900">
            <img src="assets/hero_steel.jpg" alt="Perfis Dobrados" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70">
            <div class="absolute inset-0 bg-gradient-to-t from-brand-gray-950 via-brand-gray-950/40 to-transparent"></div>
            <span class="absolute top-3 left-3 bg-brand-gray-900 border border-brand-gray-700 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
              U Simples & Enrijecido
            </span>
          </div>
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 text-brand-red mb-1">
                <i data-lucide="box" class="w-4 h-4"></i>
                <span class="text-[11px] font-bold uppercase tracking-wider text-brand-gray-400">Estruturas Metálicas</span>
              </div>
              <h3 class="font-barlow font-bold text-xl text-white uppercase group-hover:text-brand-red transition-colors">
                Perfis Dobrados
              </h3>
              <p class="text-brand-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Perfis estruturais dobrados a frio com rigorosa padronização de abas e espessuras. Essenciais para terças, colunas e travamentos de coberturas.
              </p>
            </div>
            <button onclick="openWhatsAppModal('Perfis Dobrados')" class="mt-5 w-full py-2.5 px-3 rounded-lg bg-brand-gray-900 hover:bg-brand-red text-white text-xs font-bold uppercase tracking-wider transition-colors border border-brand-gray-800 hover:border-brand-red flex items-center justify-center gap-2">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              <span>Cotar Perfis Dobrados</span>
            </button>
          </div>
        </div>

        <!-- PRODUTO 10: PAINÉIS -->
        <div class="bg-brand-gray-950 border border-brand-gray-800 rounded-2xl overflow-hidden hover:border-brand-red/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl flex flex-col">
          <div class="relative h-44 overflow-hidden bg-brand-gray-900">
            <img src="assets/telhas_trapezoidais.jpg" alt="Painéis Metálicos" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75">
            <div class="absolute inset-0 bg-gradient-to-t from-brand-gray-950 via-brand-gray-950/40 to-transparent"></div>
            <span class="absolute top-3 left-3 bg-brand-red text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow">
              Fechamentos Ágeis
            </span>
          </div>
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 text-brand-red mb-1">
                <i data-lucide="layout-grid" class="w-4 h-4"></i>
                <span class="text-[11px] font-bold uppercase tracking-wider text-brand-gray-400">Paredes & Fachadas</span>
              </div>
              <h3 class="font-barlow font-bold text-xl text-white uppercase group-hover:text-brand-red transition-colors">
                Painéis
              </h3>
              <p class="text-brand-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Painéis metálicos e isotérmicos para fechamentos laterais industriais rápidos, divisórias internas limpas e fachadas arquitetônicas.
              </p>
            </div>
            <button onclick="openWhatsAppModal('Painéis Metálicos')" class="mt-5 w-full py-2.5 px-3 rounded-lg bg-brand-gray-900 hover:bg-brand-red text-white text-xs font-bold uppercase tracking-wider transition-colors border border-brand-gray-800 hover:border-brand-red flex items-center justify-center gap-2">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              <span>Cotar Painéis</span>
            </button>
          </div>
        </div>

        <!-- PRODUTO 11: CALHAS -->
        <div class="bg-brand-gray-950 border border-brand-gray-800 rounded-2xl overflow-hidden hover:border-brand-red/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl flex flex-col">
          <div class="relative h-44 overflow-hidden bg-brand-gray-900">
            <img src="assets/hero_steel.jpg" alt="Calhas e Rufos" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75">
            <div class="absolute inset-0 bg-gradient-to-t from-brand-gray-950 via-brand-gray-950/40 to-transparent"></div>
            <span class="absolute top-3 left-3 bg-brand-gray-900 border border-brand-gray-700 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
              Drenagem Pluvial
            </span>
          </div>
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 text-brand-red mb-1">
                <i data-lucide="droplet" class="w-4 h-4"></i>
                <span class="text-[11px] font-bold uppercase tracking-wider text-brand-gray-400">Proteção de Cobertura</span>
              </div>
              <h3 class="font-barlow font-bold text-xl text-white uppercase group-hover:text-brand-red transition-colors">
                Calhas
              </h3>
              <p class="text-brand-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Calhas, rufos e condutores moldados em aço para escoamento pluvial seguro, prevenindo infiltrações e assegurando estanqueidade total à cobertura.
              </p>
            </div>
            <button onclick="openWhatsAppModal('Calhas e Rufos')" class="mt-5 w-full py-2.5 px-3 rounded-lg bg-brand-gray-900 hover:bg-brand-red text-white text-xs font-bold uppercase tracking-wider transition-colors border border-brand-gray-800 hover:border-brand-red flex items-center justify-center gap-2">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              <span>Cotar Calhas</span>
            </button>
          </div>
        </div>

        <!-- PRODUTO 12: TUBOS -->
        <div class="bg-brand-gray-950 border border-brand-gray-800 rounded-2xl overflow-hidden hover:border-brand-red/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl flex flex-col">
          <div class="relative h-44 overflow-hidden bg-brand-gray-900">
            <img src="assets/hero_steel.jpg" alt="Tubos Industriais" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75">
            <div class="absolute inset-0 bg-gradient-to-t from-brand-gray-950 via-brand-gray-950/40 to-transparent"></div>
            <span class="absolute top-3 left-3 bg-brand-red text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow">
              Metalons & Redondos
            </span>
          </div>
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 text-brand-red mb-1">
                <i data-lucide="circle-dot" class="w-4 h-4"></i>
                <span class="text-[11px] font-bold uppercase tracking-wider text-brand-gray-400">Serralheria & Estrutura</span>
              </div>
              <h3 class="font-barlow font-bold text-xl text-white uppercase group-hover:text-brand-red transition-colors">
                Tubos
              </h3>
              <p class="text-brand-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Tubos industriais de aço carbono com costura nos formatos redondo, quadrado e retangular (metalon) para serralherias e estruturas tubulares.
              </p>
            </div>
            <button onclick="openWhatsAppModal('Tubos Industriais e Metalons')" class="mt-5 w-full py-2.5 px-3 rounded-lg bg-brand-gray-900 hover:bg-brand-red text-white text-xs font-bold uppercase tracking-wider transition-colors border border-brand-gray-800 hover:border-brand-red flex items-center justify-center gap-2">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              <span>Cotar Tubos</span>
            </button>
          </div>
        </div>

        <!-- PRODUTO 13: SLITTER -->
        <div class="bg-brand-gray-950 border border-brand-gray-800 rounded-2xl overflow-hidden hover:border-brand-red/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl flex flex-col md:col-span-2 lg:col-span-1">
          <div class="relative h-44 overflow-hidden bg-brand-gray-900">
            <img src="assets/bobinas_aco.jpg" alt="Slitter de Aço" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80">
            <div class="absolute inset-0 bg-gradient-to-t from-brand-gray-950 via-brand-gray-950/40 to-transparent"></div>
            <span class="absolute top-3 left-3 bg-brand-red text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow">
              Fitas & Bobinetes
            </span>
          </div>
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 text-brand-red mb-1">
                <i data-lucide="disc" class="w-4 h-4"></i>
                <span class="text-[11px] font-bold uppercase tracking-wider text-brand-gray-400">Corte Longitudinal</span>
              </div>
              <h3 class="font-barlow font-bold text-xl text-white uppercase group-hover:text-brand-red transition-colors">
                Slitter
              </h3>
              <p class="text-brand-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Fitas e tiras de aço cortadas longitudinalmente em bobinetes na largura exata do cliente, com tolerâncias milimétricas para maquinários e prensas.
              </p>
            </div>
            <button onclick="openWhatsAppModal('Slitter de Aço')" class="mt-5 w-full py-2.5 px-3 rounded-lg bg-brand-gray-900 hover:bg-brand-red text-white text-xs font-bold uppercase tracking-wider transition-colors border border-brand-gray-800 hover:border-brand-red flex items-center justify-center gap-2">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              <span>Cotar Slitter</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  </section>"""

# Substituir a seção de produtos
pattern_produtos = r'<!-- SEÇÃO DE PRODUTOS PRINCIPAIS -->.*?<\/section>'
html = re.sub(pattern_produtos, produtos_section_new, html, flags=re.DOTALL)

# 2. ATUALIZAR FORMULÁRIO DO SIMULADOR (PRODUTOS & POLOS / BRASIL)
sim_product_old = r'<select id="simProduct".*?<\/select>'
sim_product_new = """<select id="simProduct" class="w-full bg-brand-gray-950 border border-brand-gray-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red" onchange="calculateQuote()">
              <option value="Corte e dobra">Corte e dobra</option>
              <option value="Telhas" selected>Telhas (TP40, TP25 e Onduladas)</option>
              <option value="Telhas termoacústicas">Telhas termoacústicas (Sanduíche EPS/PIR)</option>
              <option value="Bobinas Galvalume">Bobinas Galvalume</option>
              <option value="Bobinas galvanizadas">Bobinas galvanizadas</option>
              <option value="Bobinas pré-pintadas">Bobinas pré-pintadas</option>
              <option value="Chapas">Chapas</option>
              <option value="Vigas">Vigas</option>
              <option value="Perfis dobrados">Perfis dobrados</option>
              <option value="Painéis">Painéis</option>
              <option value="Calhas">Calhas</option>
              <option value="Tubos">Tubos</option>
              <option value="Slitter">Slitter</option>
            </select>"""
html = re.sub(sim_product_old, sim_product_new, html, flags=re.DOTALL)

sim_location_old = r'<select id="simLocation".*?<\/select>'
sim_location_new = """<select id="simLocation" class="w-full bg-brand-gray-950 border border-brand-gray-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red" onchange="calculateQuote()">
              <optgroup label="Polos Estratégicos JMARTINS">
                <option value="Polo Sul de Minas (MG)">Polo Sul de Minas (MG)</option>
                <option value="Polo São Paulo (SP)">Polo São Paulo (SP)</option>
                <option value="Polo Litoral Norte de Santa Catarina (SC)">Polo Litoral Norte de Santa Catarina (SC)</option>
              </optgroup>
              <optgroup label="Entregas em Todo o Brasil">
                <option value="Demais Cidades e Regiões do Brasil">Demais Regiões do Brasil (Atendimento Nacional)</option>
              </optgroup>
            </select>"""
html = re.sub(sim_location_old, sim_location_new, html, flags=re.DOTALL)

# Atualizar badge do simulador
html = html.replace('Vendedores online para Sul de MG & SP', 'Vendedores online para todo o Brasil')

# 3. SEÇÃO DE VÍDEO: REMOVER LINK DO FACEBOOK DA KATHERINE
video_buttons_old = r'<div class="pt-4 flex flex-wrap items-center gap-4">\s*<a href="https://www.facebook.com/share/v/1GdV2zauZ2/".*?<\/div>'
video_buttons_new = """<div class="pt-4 flex flex-wrap items-center gap-4">
            <button onclick="openVideoModal()" class="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-redHover text-white px-5 py-3 rounded-lg font-semibold text-xs transition-colors shadow-lg red-glow cursor-pointer">
              <i data-lucide="play" class="w-4 h-4 fill-current"></i>
              <span>Assistir Vídeo da Fábrica</span>
            </button>
            <a href="https://instagram.com/jmartinsindustrial" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-brand-gray-300 hover:text-white text-xs font-semibold">
              <i data-lucide="instagram" class="w-4 h-4 text-pink-500"></i>
              <span>Acompanhe nosso Instagram</span>
            </a>
          </div>"""
html = re.sub(video_buttons_old, video_buttons_new, html, flags=re.DOTALL)

# 4. SEÇÃO DE LOGÍSTICA & POLOS (SUL DE MINAS, SÃO PAULO E LITORAL NORTE DE SC + BRASIL)
logistica_section_old = r'<!-- LOGÍSTICA SUL DE MINAS & SÃO PAULO -->.*?<\/section>'
logistica_section_new = """<!-- LOGÍSTICA & POLOS: SUL DE MINAS, SÃO PAULO E LITORAL NORTE DE SC (ENTREGAS TODO BRASIL) -->
  <section id="logistica" class="py-24 bg-brand-gray-950 border-t border-brand-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <!-- Imagem da Logística com Caminhão na Rodovia -->
        <div class="lg:col-span-6 order-2 lg:order-1">
          <div class="relative rounded-2xl overflow-hidden border border-brand-gray-800 shadow-2xl">
            <img src="assets/logistica_sp_mg.jpg" alt="Logística Rodoviária JMartins no Sul de Minas, São Paulo e Santa Catarina" class="w-full h-auto object-cover">
            <div class="absolute bottom-4 left-4 right-4 bg-brand-gray-950/90 backdrop-blur p-4 rounded-xl border border-brand-gray-800">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-white flex items-center gap-1.5">
                  <i data-lucide="navigation" class="w-4 h-4 text-brand-red"></i> Rotas Integradas • Rodovias Nacionais & Frota Ágil
                </span>
                <span class="text-emerald-400 font-semibold">Entregas Todo Brasil</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Conteúdo Logístico -->
        <div class="lg:col-span-6 order-1 lg:order-2 space-y-6">
          <span class="text-brand-red font-bold text-xs uppercase tracking-widest bg-brand-red/10 px-3 py-1 rounded-full border border-brand-red/20">
            Atendimento Nacional
          </span>
          <h2 class="font-barlow font-black text-3xl sm:text-5xl uppercase tracking-tight text-white">
            Logística Ágil com <br>
            <span class="text-brand-red">Entregas em Todo o Brasil</span>
          </h2>
          <p class="text-brand-gray-300 text-sm sm:text-base leading-relaxed">
            Estamos estrategicamente posicionados com polos dedicados para atender com rapidez récorde e segurança de carga serralherias, revendas de ferro e aço, construtoras e galpões industriais de ponta a ponta do país.
          </p>

          <!-- 3 Polos Estratégicos -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            
            <div class="bg-brand-gray-900 border border-brand-gray-800 p-4 rounded-xl">
              <div class="text-xs font-bold text-brand-red uppercase mb-1">Polo Sul de Minas</div>
              <p class="text-[11px] text-brand-gray-300 leading-relaxed">
                Pouso Alegre, Varginha, Poços de Caldas, Itajubá, Extrema e região com saídas diárias pela Rod. Fernão Dias.
              </p>
            </div>

            <div class="bg-brand-gray-900 border border-brand-gray-800 p-4 rounded-xl">
              <div class="text-xs font-bold text-white uppercase mb-1">Polo São Paulo</div>
              <p class="text-[11px] text-brand-gray-300 leading-relaxed">
                Grande SP, Campinas, Vale do Paraíba, Circuito das Águas, Bragança Paulista e todo o Interior Paulista.
              </p>
            </div>

            <div class="bg-brand-gray-900 border border-brand-gray-800 p-4 rounded-xl">
              <div class="text-xs font-bold text-emerald-400 uppercase mb-1">Polo Litoral Norte SC</div>
              <p class="text-[11px] text-brand-gray-300 leading-relaxed">
                Joinville, Jaraguá do Sul, Itajaí, Balneário Camboriú, Navegantes e polo metalmecânico catarinense.
              </p>
            </div>

          </div>

          <div class="p-3 bg-brand-gray-900/60 border border-brand-gray-800/80 rounded-xl flex items-center gap-3">
            <i data-lucide="truck" class="w-5 h-5 text-brand-red shrink-0"></i>
            <span class="text-xs text-brand-gray-300">
              <strong class="text-white">Demais Regiões do Brasil:</strong> Cargas fracionadas ou carretas fechadas despachadas com rastreamento e pontualidade.
            </span>
          </div>

          <div class="pt-2">
            <button onclick="openWhatsAppModal('Consulta de Entrega e Frete')" class="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-redHover text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer">
              <i data-lucide="map" class="w-4 h-4"></i>
              <span>Consultar Prazo para Minha Cidade</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  </section>"""
html = re.sub(logistica_section_old, logistica_section_new, html, flags=re.DOTALL)

# 5. MODAL DE VÍDEO: REMOVER FALLBACK FACEBOOK E DEIXAR PLAYER NATIVO MP4 DIRETO
video_modal_old = r'<div class="relative bg-black rounded-xl overflow-hidden aspect-video flex flex-col items-center justify-center border border-brand-gray-800 shadow-2xl">.*?<\/div>\s*<\/div>\s*<div class="flex items-center justify-center gap-4 text-xs text-brand-gray-400">.*?<\/div>'
video_modal_new = """<div class="relative bg-black rounded-xl overflow-hidden aspect-video flex flex-col items-center justify-center border border-brand-gray-800 shadow-2xl">
          <!-- Player HTML5 MP4 Nativo de Alta Definição -->
          <video id="instVideoPlayer" controls playsinline class="w-full h-full object-contain" poster="assets/hero_steel.jpg">
            <source id="instVideoSource" src="assets/video_institucional.mp4" type="video/mp4">
            Seu navegador não suporta reprodução de vídeo MP4.
          </video>
        </div>

        <div class="flex items-center justify-center gap-4 text-xs text-brand-gray-400 flex-wrap">
          <span class="flex items-center gap-1"><i data-lucide="check" class="w-4 h-4 text-brand-red"></i> Aço Certificado</span>
          <span class="flex items-center gap-1"><i data-lucide="check" class="w-4 h-4 text-brand-red"></i> Bobinas Pronta-Entrega</span>
          <span class="flex items-center gap-1"><i data-lucide="check" class="w-4 h-4 text-brand-red"></i> Polos: MG, SP e SC</span>
          <span class="flex items-center gap-1"><i data-lucide="check" class="w-4 h-4 text-brand-red"></i> Entregas Todo o Brasil</span>
        </div>"""
html = re.sub(video_modal_old, video_modal_new, html, flags=re.DOTALL)

# 6. MODAL MULTI-CONSULTOR WHATSAPP (8 NÚMEROS)
whatsapp_modal_html = """
  <!-- MODAL DE ATENDIMENTO WHATSAPP MULTI-CONSULTOR (8 LINHAS COMERCIAIS) -->
  <div id="whatsappModal" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md hidden flex items-center justify-center p-4">
    <div class="relative w-full max-w-2xl bg-brand-gray-900 border border-brand-gray-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
      
      <!-- Faixa Decorativa Superior -->
      <div class="h-1.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500"></div>

      <!-- Header do Modal -->
      <div class="p-6 border-b border-brand-gray-800 flex items-start justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-white font-barlow font-bold text-xl uppercase tracking-tight">Equipe Comercial no WhatsApp</h3>
            <p id="whatsappModalSubject" class="text-xs text-brand-gray-400 mt-0.5">Selecione um dos 8 consultores para atendimento ou cotação imediata:</p>
          </div>
        </div>
        <button onclick="closeWhatsAppModal()" class="text-brand-gray-400 hover:text-white p-2 rounded-lg hover:bg-brand-gray-800 transition-colors">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Botão Atendimento Rápido Express -->
      <div class="px-6 pt-4 pb-2">
        <button onclick="startQuickWhatsApp()" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01] cursor-pointer">
          <i data-lucide="zap" class="w-4 h-4 fill-current"></i>
          <span>Conectar com Primeiro Consultor Disponível Agora</span>
        </button>
      </div>

      <!-- Grid com os 8 Consultores -->
      <div class="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1" id="whatsappConsultantsGrid">
        <!-- Renderizado dinamicamente via JS -->
      </div>

      <!-- Rodapé com Telefones Fixos -->
      <div class="p-4 bg-brand-gray-950 border-t border-brand-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-gray-400 gap-2">
        <span class="flex items-center gap-1.5 flex-wrap">
          <i data-lucide="phone" class="w-3.5 h-3.5 text-brand-red"></i>
          Televendas / Telefones Fixos: <a href="tel:1936722881" class="text-white hover:text-brand-red font-semibold">(19) 3672-2881</a> • <a href="tel:1936721563" class="text-white hover:text-brand-red font-semibold">(19) 3672-1563</a>
        </span>
        <span class="text-emerald-400 font-semibold flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Entregas em Todo o Brasil
        </span>
      </div>

    </div>
  </div>
"""

# Inserir o whatsapp modal antes do modal de vídeo
html = html.replace('<!-- MODAL DE VÍDEO INSTITUCIONAL -->', whatsapp_modal_html + '\n  <!-- MODAL DE VÍDEO INSTITUCIONAL -->')

# Atualizar o botão flutuante para chamar openWhatsAppModal
floating_btn_old = r'<a id="floatingWhatsappBtn".*?<\/a>'
floating_btn_new = """<button id="floatingWhatsappBtn" onclick="openWhatsAppModal()" 
       class="relative w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-110 transition-transform cursor-pointer"
       title="Falar no WhatsApp com nossa Equipe (8 Consultores)">
      <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
      </svg>
      <span class="absolute -top-1 -right-1 flex h-4 w-4">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-4 w-4 bg-emerald-600 border border-white"></span>
      </span>
    </button>"""
html = re.sub(floating_btn_old, floating_btn_new, html, flags=re.DOTALL)

# 7. FOOTER INDUSTRIAL: ATUALIZAR PRODUTOS (SEM FIXADORES/PARAFUSOS), POLOS E TELEFONES FIXOS
footer_old = r'<!-- FOOTER INDUSTRIAL -->.*?<\/footer>'
footer_new = """<!-- FOOTER INDUSTRIAL -->
  <footer class="bg-brand-gray-950 border-t border-brand-gray-800 text-brand-gray-400 text-xs py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        
        <!-- Col 1: Marca -->
        <div class="space-y-4">
          <div class="flex items-center">
            <img src="assets/logo_jmartins_white.png" alt="Jmartins do Brasil" class="h-10 w-auto object-contain">
          </div>
          <p class="text-brand-gray-400 text-xs leading-relaxed">
            Especialista no fornecimento direto de bobinas Galvalume, galvanizadas, pré-pintadas, corte e dobra e telhas termoacústicas sob medida. Entregas em todo o Brasil.
          </p>
          <div class="flex items-center gap-3 pt-2">
            <a id="footerSocialInstagram" href="https://instagram.com/jmartinsindustrial" target="_blank" class="w-8 h-8 rounded bg-brand-gray-900 border border-brand-gray-800 hover:text-brand-red flex items-center justify-center transition-colors">
              <i data-lucide="instagram" class="w-4 h-4"></i>
            </a>
            <a href="javascript:void(0)" onclick="openVideoModal()" class="w-8 h-8 rounded bg-brand-gray-900 border border-brand-gray-800 hover:text-brand-red flex items-center justify-center transition-colors cursor-pointer" title="Vídeo da Fábrica">
              <i data-lucide="film" class="w-4 h-4"></i>
            </a>
          </div>
        </div>

        <!-- Col 2: Linha de Produtos (Apenas os 13 oficiais, SEM fixadores) -->
        <div>
          <h4 class="font-bold text-white uppercase text-xs tracking-wider mb-4">Linha de Produtos</h4>
          <ul class="space-y-2">
            <li><a href="#produtos" class="hover:text-brand-red transition-colors">Corte e Dobra</a></li>
            <li><a href="#produtos" class="hover:text-brand-red transition-colors">Telhas & Telhas Termoacústicas</a></li>
            <li><a href="#produtos" class="hover:text-brand-red transition-colors">Bobinas Galvalume & Galvanizadas</a></li>
            <li><a href="#produtos" class="hover:text-brand-red transition-colors">Bobinas Pré-pintadas</a></li>
            <li><a href="#produtos" class="hover:text-brand-red transition-colors">Chapas & Vigas Estruturais</a></li>
            <li><a href="#produtos" class="hover:text-brand-red transition-colors">Perfis Dobrados & Painéis</a></li>
            <li><a href="#produtos" class="hover:text-brand-red transition-colors">Calhas, Tubos & Slitter</a></li>
          </ul>
        </div>

        <!-- Col 3: Região de Atendimento & Polos -->
        <div>
          <h4 class="font-bold text-white uppercase text-xs tracking-wider mb-4">Polos & Entregas Brasil</h4>
          <p id="footerAddressText" class="text-xs text-brand-gray-300 leading-relaxed mb-3 font-semibold">
            Polos: Sul de Minas, São Paulo e Litoral Norte de SC • Entregas em todo o Brasil
          </p>
          <ul class="space-y-1.5 text-brand-gray-400">
            <li class="text-white font-medium">Polo Sul de Minas (MG):</li>
            <li class="pl-2">• Pouso Alegre, Varginha, Poços de Caldas, Extrema</li>
            <li class="text-white font-medium pt-1">Polo São Paulo (SP):</li>
            <li class="pl-2">• Vale do Paraíba, Campinas, Capital e Interior</li>
            <li class="text-white font-medium pt-1">Polo Litoral Norte de Santa Catarina (SC):</li>
            <li class="pl-2">• Joinville, Itajaí, Balneário Camboriú e Região</li>
            <li class="text-brand-red font-medium pt-1">• Atendimento Nacional em Todo o Brasil</li>
          </ul>
        </div>

        <!-- Col 4: Contato & Cotações -->
        <div>
          <h4 class="font-bold text-white uppercase text-xs tracking-wider mb-4">Canais de Atendimento</h4>
          <div class="space-y-3">
            
            <!-- WhatsApp (8 Consultores) -->
            <div class="flex items-start gap-2">
              <i data-lucide="message-square" class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"></i>
              <div>
                <span class="block text-white font-semibold">WhatsApp Vendas (8 Linhas)</span>
                <button onclick="openWhatsAppModal()" class="text-brand-gray-300 hover:text-emerald-400 transition-colors block text-left font-medium">
                  Ver Todos os 8 Consultores
                </button>
                <div class="text-[11px] text-brand-gray-400 mt-0.5">
                  (19) 99816-7195 / (19) 99773-1046...
                </div>
              </div>
            </div>

            <!-- Telefones Fixos -->
            <div id="footerPhoneContainer" class="flex items-start gap-2">
              <i data-lucide="phone" class="w-4 h-4 text-brand-red shrink-0 mt-0.5"></i>
              <div>
                <span class="block text-white font-semibold">Telefones Fixos</span>
                <div class="flex flex-col gap-0.5">
                  <a href="tel:1936722881" class="text-brand-gray-300 hover:text-white transition-colors">
                    (19) 3672-2881
                  </a>
                  <a href="tel:1936721563" class="text-brand-gray-300 hover:text-white transition-colors">
                    (19) 3672-1563
                  </a>
                </div>
              </div>
            </div>

            <!-- E-mail -->
            <div id="footerEmailContainer" class="flex items-start gap-2">
              <i data-lucide="mail" class="w-4 h-4 text-blue-400 shrink-0 mt-0.5"></i>
              <div>
                <span class="block text-white font-semibold">E-mail Comercial</span>
                <a id="footerEmailLink" href="mailto:contato@jmartins.ind.br" class="text-brand-gray-400 hover:text-white transition-colors block">
                  <span id="footerEmailText">contato@jmartins.ind.br</span>
                </a>
              </div>
            </div>

            <!-- Instagram -->
            <div class="flex items-start gap-2">
              <i data-lucide="instagram" class="w-4 h-4 text-pink-400 shrink-0 mt-0.5"></i>
              <div>
                <span class="block text-white font-semibold">Instagram Oficial</span>
                <a id="footerInstagramLink" href="https://instagram.com/jmartinsindustrial" target="_blank" class="text-brand-gray-400 hover:text-white transition-colors">
                  <span id="footerInstagramText">@jmartinsindustrial</span>
                </a>
              </div>
            </div>

            <div class="pt-2">
              <button onclick="openAdminModal('company')" class="inline-flex items-center gap-1.5 text-brand-gray-500 hover:text-brand-red transition-colors text-[11px]">
                <i data-lucide="shield" class="w-3.5 h-3.5"></i> Editar Dados no Painel Adm
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Copyright e Assinatura Técnica -->
      <div class="pt-8 border-t border-brand-gray-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-brand-gray-500">
        <div>
          © 2026 JMartins Industrial. Todos os direitos reservados. Entregas em todo o Brasil.
        </div>
        <div class="text-[11px]">
          Qualidade, Robustez e Pontualidade em Soluções Metálicas.
        </div>
      </div>

    </div>
  </footer>"""
html = re.sub(footer_old, footer_new, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("PART_1_COMPLETED")
