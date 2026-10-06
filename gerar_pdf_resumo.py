# -*- coding: utf-8 -*-
import os
import shutil
import subprocess

html_content = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Manual Técnico de Indicadores Financeiros e DRE Gerencial</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 14mm 14mm 14mm;
      @bottom-right {
        content: counter(page);
      }
    }
    
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1F2937;
      background-color: #FFFFFF;
      line-height: 1.45;
      font-size: 12px;
      margin: 0;
      padding: 0;
    }

    /* Cabeçalho */
    .header {
      border-bottom: 2px solid #0F2B27;
      padding-bottom: 10px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .header-left h1 {
      font-size: 18px;
      font-weight: 800;
      color: #0F2B27;
      margin: 0 0 3px 0;
      letter-spacing: -0.2px;
      text-transform: uppercase;
    }

    .header-left .subtitle {
      font-size: 11.5px;
      color: #1F5C52;
      font-weight: 600;
      margin: 0;
    }

    .header-right {
      text-align: right;
      font-size: 10.5px;
      color: #6B7280;
    }

    .badge-doc {
      display: inline-block;
      background: #D9EBE6;
      color: #0F2B27;
      font-size: 9.5px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 4px;
      margin-bottom: 3px;
      text-transform: uppercase;
    }

    /* Títulos de Seção */
    .section-title {
      font-size: 12.5px;
      font-weight: 800;
      color: #0F2B27;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1.5px solid #E5E7EB;
      padding-bottom: 3px;
      margin: 14px 0 10px 0;
    }

    /* Cards de Indicadores */
    .grid-indicators {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 12px;
    }

    .indicator-card {
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      padding: 9px 11px;
      background: #FFFFFF;
      page-break-inside: avoid;
    }

    .indicator-card.full-width {
      grid-column: span 2;
    }

    .indicator-card-title {
      font-size: 12px;
      font-weight: 700;
      color: #0F2B27;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .tag-category {
      font-size: 9px;
      font-weight: 700;
      background: #F3F4F6;
      color: #4B5563;
      padding: 1px 5px;
      border-radius: 3px;
      text-transform: uppercase;
    }

    .formula-line {
      background: #F8FAF9;
      border: 1px solid #D9EBE6;
      border-radius: 4px;
      padding: 4px 7px;
      font-family: "Courier New", Courier, monospace;
      font-size: 11px;
      font-weight: 700;
      color: #065F46;
      margin: 4px 0 6px 0;
    }

    .rule-item {
      font-size: 11px;
      color: #374151;
      margin-bottom: 3px;
      line-height: 1.35;
    }

    .rule-item strong {
      color: #111827;
    }

    /* Tabela da Matriz */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 14px 0;
      font-size: 11px;
      page-break-inside: avoid;
    }

    th {
      background: #0F2B27;
      color: #FFFFFF;
      font-weight: 700;
      text-align: left;
      padding: 6px 8px;
      border: 1px solid #0F2B27;
      text-transform: uppercase;
      font-size: 10px;
    }

    td {
      padding: 6px 8px;
      border: 1px solid #E5E7EB;
      vertical-align: top;
    }

    tr:nth-child(even) {
      background: #F9FAFB;
    }

    /* Modelo DRE Gerencial */
    .dre-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 11px;
    }

    .dre-table th {
      background: #1F5C52;
      border-color: #1F5C52;
    }

    .dre-table td {
      padding: 5px 8px;
    }

    .dre-row-header {
      font-weight: 700;
      background: #F3F4F6;
    }

    .dre-row-subtotal {
      font-weight: 700;
      background: #ECFDF5;
      color: #065F46;
      border-top: 1.5px solid #10B981;
      border-bottom: 1.5px solid #10B981;
    }

    .dre-row-total {
      font-weight: 800;
      background: #D9EBE6;
      color: #0F2B27;
      font-size: 11.5px;
      border-top: 2px solid #0F2B27;
      border-bottom: 2px solid #0F2B27;
    }

    .footnote {
      font-size: 10px;
      color: #6B7280;
      margin-top: 12px;
      border-top: 1px solid #E5E7EB;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>

  <!-- Cabeçalho -->
  <div class="header">
    <div class="header-left">
      <span class="badge-doc">Manual Técnico de Controladoria</span>
      <h1>Especificação de Indicadores & DRE Gerencial</h1>
      <p class="subtitle">Normatização de Parâmetros, Matriz de Cálculo e Modelo Operacional</p>
    </div>
    <div class="header-right">
      <strong>Referência:</strong> Versão Normativa 2.0<br>
      <strong>Data:</strong> Outubro / 2026<br>
      <strong>Finalidade:</strong> Padronização Contábil & BI
    </div>
  </div>

  <!-- 1. ITENS E FÓRMULAS OFICIAIS -->
  <div class="section-title">1. Especificação Técnica dos Indicadores</div>
  
  <div class="grid-indicators">
    
    <!-- Receita Bruta -->
    <div class="indicator-card">
      <div class="indicator-card-title">
        <span>Receita Bruta</span>
        <span class="tag-category">Vendas</span>
      </div>
      <div class="formula-line">Receita Bruta = ∑ (Total dos Pedidos Entregues)</div>
      <div class="rule-item">• <strong>Critério:</strong> Pedidos com status <em>"Entregue"</em> cuja data de entrega ocorre no mês de apuração.</div>
      <div class="rule-item">• <strong>Ajustes:</strong> Valor líquido de cupons de desconto concedidos. O frete compõe a receita apenas se for cobrado diretamente do cliente.</div>
    </div>

    <!-- Custos Variáveis -->
    <div class="indicator-card">
      <div class="indicator-card-title">
        <span>Custos Variáveis (CMV / CPV)</span>
        <span class="tag-category">Custo Direto</span>
      </div>
      <div class="formula-line">CV = ∑ (Custo Unitário Direto × Qtd Entregue)</div>
      <div class="rule-item">• <strong>Revenda (CMV):</strong> Custo de aquisição dos itens comercializados que foram entregues.</div>
      <div class="rule-item">• <strong>Produção (CPV):</strong> Matéria-prima + embalagens diretas dos produtos fabricados e entregues.</div>
      <div class="rule-item">• <strong>Regra:</strong> Não considerar pagamentos de estoque como custo do mês.</div>
    </div>

    <!-- Despesas Variáveis -->
    <div class="indicator-card">
      <div class="indicator-card-title">
        <span>Despesas Variáveis (DV)</span>
        <span class="tag-category">Comercialização</span>
      </div>
      <div class="formula-line">DV = Impostos + Comissões + Taxas Gateway + Embalagens</div>
      <div class="rule-item">• <strong>Impostos:</strong> % de alíquota efetiva (Simples/Presumido) sobre a receita.</div>
      <div class="rule-item">• <strong>Comissões:</strong> % fixado para canais de venda / marketplaces.</div>
      <div class="rule-item">• <strong>Gateway:</strong> (% do adquirente × Valor Total com Frete) + Tarifas Fixas por pedido.</div>
    </div>

    <!-- Margem de Contribuição -->
    <div class="indicator-card">
      <div class="indicator-card-title">
        <span>Margem de Contribuição (MC e MC%)</span>
        <span class="tag-category">Rentabilidade</span>
      </div>
      <div class="formula-line">MC = Receita Bruta − CV − DV &nbsp;|&nbsp; MC% = MC ÷ Receita Bruta</div>
      <div class="rule-item">• <strong>MC (R$):</strong> Sobra financeira gerada pelas vendas para cobrir a estrutura fixa.</div>
      <div class="rule-item">• <strong>MC (%):</strong> Índice percentual de margem sobre cada R$ 1,00 faturado.</div>
    </div>

    <!-- Custos Fixos e Lucro -->
    <div class="indicator-card">
      <div class="indicator-card-title">
        <span>Custos Fixos (CF) & Lucro Operacional</span>
        <span class="tag-category">Estrutura</span>
      </div>
      <div class="formula-line">Lucro Operacional = MC − Custos Fixos (CF)</div>
      <div class="rule-item">• <strong>Custos Fixos (CF):</strong> Folha de pagamento, encargos, pró-labore, aluguel, energia, água, licenças de software e contabilidade.</div>
      <div class="rule-item">• <strong>Regra:</strong> Investimentos em ativos permanentes (CAPEX) não compõem o CF.</div>
    </div>

    <!-- Ponto de Equilíbrio Operacional e Econômico -->
    <div class="indicator-card">
      <div class="indicator-card-title">
        <span>Ponto de Equilíbrio (PE e Meta PE)</span>
        <span class="tag-category">Metas / Break-Even</span>
      </div>
      <div class="formula-line">PE = CF ÷ MC% &nbsp;|&nbsp; Meta PE = (CF + Meta de Lucro) ÷ MC%</div>
      <div class="rule-item">• <strong>PE (Operacional):</strong> Faturamento mínimo para cobrir 100% dos custos fixos com lucro igual a zero.</div>
      <div class="rule-item">• <strong>Meta PE (Econômico):</strong> Faturamento exigido para cobrir o CF e atingir a meta de lucro líquido estipulada.</div>
    </div>

  </div>

  <!-- 2. MATRIZ COMPARATIVA -->
  <div class="section-title">2. Matriz de Parâmetros e Indicadores</div>
  <table>
    <thead>
      <tr>
        <th style="width: 22%;">Indicador</th>
        <th style="width: 32%;">Fórmula Paramétrica</th>
        <th style="width: 26%;">Base de Dados</th>
        <th style="width: 20%;">Função no Modelo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Receita Bruta (RB)</strong></td>
        <td><code>∑ (Valor Total dos Pedidos Entregues)</code></td>
        <td>Pedidos com status = entregue no mês</td>
        <td>Base de faturamento (100%)</td>
      </tr>
      <tr>
        <td><strong>Custo Variável (CV)</strong></td>
        <td><code>∑ (Custo Unitário × Qtd Entregue)</code></td>
        <td>Ficha técnica / Cadastro de compra</td>
        <td>CMV (revenda) ou CPV (produção)</td>
      </tr>
      <tr>
        <td><strong>Despesa Variável (DV)</strong></td>
        <td><code>Impostos + Comissões + Gateway + Frete</code></td>
        <td>Parâmetros fiscais e taxas contratuais</td>
        <td>Custos atrelados à venda</td>
      </tr>
      <tr>
        <td><strong>Margem Contribuição (MC)</strong></td>
        <td><code>Receita Bruta − CV − DV</code></td>
        <td>Resultado intermediário</td>
        <td>Massa de contribuição em R$</td>
      </tr>
      <tr>
        <td><strong>Índice de Margem (MC%)</strong></td>
        <td><code>MC ÷ Receita Bruta</code></td>
        <td>Proporção matemática</td>
        <td>Eficiência do mix comercial</td>
      </tr>
      <tr>
        <td><strong>Custo Fixo (CF)</strong></td>
        <td><code>∑ (Despesas Operacionais Recorrentes)</code></td>
        <td>Saídas de caixa de estrutura mensal</td>
        <td>Custo de manutenção da empresa</td>
      </tr>
      <tr>
        <td><strong>Lucro Operacional</strong></td>
        <td><code>MC − CF</code></td>
        <td>MC menos Custo Fixo</td>
        <td>EBITDA / Resultado operacional</td>
      </tr>
      <tr>
        <td><strong>Ponto de Equilíbrio (PE)</strong></td>
        <td><code>CF ÷ MC%</code></td>
        <td>Custo Fixo dividido pelo índice MC%</td>
        <td>Faturamento de ponto zero</td>
      </tr>
      <tr>
        <td><strong>Meta PE (Econômico)</strong></td>
        <td><code>(CF + Meta de Lucro) ÷ MC%</code></td>
        <td>(CF + Lucro Alvo) dividido por MC%</td>
        <td>Meta de vendas planejada</td>
      </tr>
    </tbody>
  </table>

  <!-- 3. NOVO MODELO DE DRE GERENCIAL -->
  <div class="section-title">3. Modelo Estruturado de DRE Gerencial</div>
  <table class="dre-table">
    <thead>
      <tr>
        <th style="width: 55%;">Estrutura de Contas Gerenciais (DRE)</th>
        <th style="width: 25%; text-align: center;">Regra de Cálculo</th>
        <th style="width: 20%; text-align: right;">% Referência</th>
      </tr>
    </thead>
    <tbody>
      <tr class="dre-row-header">
        <td><strong>1. RECEITA BRUTA DE VENDAS</strong></td>
        <td style="text-align: center;">Pedidos Entregues</td>
        <td style="text-align: right;"><strong>100,0%</strong></td>
      </tr>
      <tr>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;1.1. Receita de Produtos / Mercadorias Entregues</td>
        <td style="text-align: center;">Subtotal dos Itens</td>
        <td style="text-align: right;">92,0%</td>
      </tr>
      <tr>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;1.2. Fretes Cobrados dos Clientes</td>
        <td style="text-align: center;">Valor de Frete Pago</td>
        <td style="text-align: right;">8,0%</td>
      </tr>
      <tr>
        <td><strong>(−) 2. CUSTOS VARIÁVEIS DAS VENDAS (CMV / CPV)</strong></td>
        <td style="text-align: center;">Custo Unitário × Qtd</td>
        <td style="text-align: right;"><strong>-38,0%</strong></td>
      </tr>
      <tr>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;2.1. Custo dos Produtos Vendidos (Matéria-prima / Revenda)</td>
        <td style="text-align: center;">Itens Entregues</td>
        <td style="text-align: right;">-35,0%</td>
      </tr>
      <tr>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;2.2. Insumos Diretos de Expedição (Caixas, Fitas, Envelopes)</td>
        <td style="text-align: center;">Unidades Utilizadas</td>
        <td style="text-align: right;">-3,0%</td>
      </tr>
      <tr>
        <td><strong>(−) 3. DESPESAS VARIÁVEIS SOBRE VENDAS (DV)</strong></td>
        <td style="text-align: center;">Percentuais Contratuais</td>
        <td style="text-align: right;"><strong>-18,5%</strong></td>
      </tr>
      <tr>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;3.1. Tributação sobre Vendas (Simples Nacional / Presumido)</td>
        <td style="text-align: center;">% Efetivo Fiscal</td>
        <td style="text-align: right;">-6,0%</td>
      </tr>
      <tr>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;3.2. Comissões de Vendas & Taxas de Marketplaces</td>
        <td style="text-align: center;">% Canal de Venda</td>
        <td style="text-align: right;">-3,5%</td>
      </tr>
      <tr>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;3.3. Taxas de Adquirentes e Gateways de Pagamento</td>
        <td style="text-align: center;">% Total + Taxa Fixa</td>
        <td style="text-align: right;">-3,0%</td>
      </tr>
      <tr>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;3.4. Fretes de Envio Repassados a Transportadoras</td>
        <td style="text-align: center;">Repasse Operacional</td>
        <td style="text-align: right;">-6,0%</td>
      </tr>
      <tr class="dre-row-subtotal">
        <td><strong>(=) 4. MARGEM DE CONTRIBUIÇÃO TOTAL (MC)</strong></td>
        <td style="text-align: center;"><strong>Receita − (2 + 3)</strong></td>
        <td style="text-align: right;"><strong>43,5%</strong></td>
      </tr>
      <tr>
        <td><strong>(−) 5. CUSTOS E DESPESAS FIXAS OPERACIONAIS (CF)</strong></td>
        <td style="text-align: center;">Gastos Estruturais</td>
        <td style="text-align: right;"><strong>-26,0%</strong></td>
      </tr>
      <tr>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;5.1. Folha de Pagamento, Encargos e Benefícios da Equipe</td>
        <td style="text-align: center;">Valor Fixo Mensal</td>
        <td style="text-align: right;">-15,0%</td>
      </tr>
      <tr>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;5.2. Aluguel, Condomínio, Energia, Água e Manutenção</td>
        <td style="text-align: center;">Estrutura Física</td>
        <td style="text-align: right;">-6,0%</td>
      </tr>
      <tr>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;5.3. Softwares, Sistemas de Gestão, Servidores e Telefonia</td>
        <td style="text-align: center;">Infraestrutura TI</td>
        <td style="text-align: right;">-3,0%</td>
      </tr>
      <tr>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;5.4. Pró-labore da Diretoria e Assessoria Contábil</td>
        <td style="text-align: center;">Administrativo</td>
        <td style="text-align: right;">-2,0%</td>
      </tr>
      <tr class="dre-row-total">
        <td><strong>(=) 6. LUCRO OPERACIONAL LÍQUIDO (EBITDA GERENCIAL)</strong></td>
        <td style="text-align: center;"><strong>MC − CF</strong></td>
        <td style="text-align: right;"><strong>17,5%</strong></td>
      </tr>
    </tbody>
  </table>

  <!-- Rodapé -->
  <div class="footnote">
    <span>Documento Técnico Normativo de Controladoria • Sistema AMP Flow</span>
    <span>Parametrização Oficial para BI e Gestão Financeira</span>
  </div>

</body>
</html>"""

# Salva arquivo HTML
html_path = os.path.abspath('relatorio_indicadores_dre.html')
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print("[INFO] HTML gerado em: " + html_path)

# Destinos do PDF
destinos = [
    os.path.abspath('Relatorio_Indicadores_Financeiros_DRE.pdf'),
    os.path.abspath(os.path.join('public', 'Relatorio_Indicadores_Financeiros_DRE.pdf')),
    r'C:\Users\Administrador\.gemini\antigravity\brain\6bffaa52-4508-4292-b5fb-6ebfbe09d5e7\Relatorio_Indicadores_Financeiros_DRE.pdf'
]

browser_candidates = [
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    r'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
]

browser_exe = None
for b in browser_candidates:
    if os.path.exists(b):
        browser_exe = b
        break

if not browser_exe:
    print("[ERRO] Navegador nao encontrado.")
    exit(1)

primeiro_destino = destinos[0]
file_url = f"file:///{html_path.replace(os.sep, '/')}"

cmd = [
    browser_exe,
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    f'--print-to-pdf={primeiro_destino}',
    file_url
]

res = subprocess.run(cmd, capture_output=True, text=True)
print(f"[INFO] Processo finalizado com codigo: {res.returncode}")

if os.path.exists(primeiro_destino):
    size_kb = os.path.getsize(primeiro_destino) / 1024
    print(f"[OK] PDF gerado com sucesso: {primeiro_destino} ({size_kb:.1f} KB)")
    
    for dest in destinos[1:]:
        try:
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            shutil.copy2(primeiro_destino, dest)
            print(f"[OK] Copia salva em: {dest}")
        except Exception as e:
            print(f"[AVISO] Erro ao copiar para {dest}: {e}")
else:
    print("[ERRO] Falha na criacao do PDF.")
    print("Stderr:", res.stderr)
