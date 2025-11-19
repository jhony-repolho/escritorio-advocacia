# TODO - Site Escritório de Advocacia

## Estrutura e Design
- [x] Definir paleta de cores minimalista e elegante
- [x] Configurar tipografia profissional
- [x] Criar layout responsivo

## Páginas e Seções
- [x] Página inicial (Home)
- [x] Seção sobre o escritório (informações institucionais)
- [x] Seção de áreas de atuação (Previdenciário, Imobiliário, Sucessões)
- [x] Página de artigos jurídicos
- [x] Página de vídeos
- [x] Formulário de contato
- [x] Formulário de revisão

## Componentes
- [x] Header/navegação
- [x] Footer
- [x] Cards para áreas de atuação
- [x] Cards para artigos
- [x] Player de vídeo ou embed
- [x] Formulários com validação

## Conteúdo
- [x] Adicionar conteúdo de exemplo para artigos
- [x] Adicionar vídeos de exemplo
- [x] Textos institucionais

## Alterações de Design
- [x] Mudar paleta de cores para azul e laranja do INSS
- [x] Mudar nome para "Silva e Repolho: Advogados Associados"

## Novas Funcionalidades
- [x] Remover aba de Vídeos
- [x] Adicionar vídeos aos artigos
- [x] Criar aba Calculadora Revisional com campos para imóvel, entrada, valor financiado, taxa de juros, parcela, vencimento, data do contrato, índice de correção

## Informações de Contato
- [x] Adicionar endereço com mapa
- [x] Adicionar telefone e WhatsApp
- [x] Adicionar e-mail
- [x] Alterar telefone para (91) 98319-0800
- [x] Remover opções TR e Selic da calculadora
- [x] Incluir INPC como opção de correção monetária
- [x] Remover IGPM e INPC da calculadora
- [x] Fazer upgrade do projeto para incluir banco de dados
- [x] Extrair dados dos arquivos Excel (INCC.xlsx e IPCA.xlsx)
- [x] Criar tabelas de índices no banco de dados
- [x] Implementar API para consultar índices por data
- [x] Integrar índices com a calculadora revisional (estrutura pronta, dados pendentes de importação)


## Implementação da Calculadora Revisional (Lógica Completa)
- [x] Implementar função de cálculo PRICE (juros compostos com correção monetária)
- [x] Implementar função de cálculo MQJS (juros simples com limite de 1% a.m. e correção monetária)
- [x] Implementar função de comparação e cálculo da diferença corrigida
- [x] Criar endpoint tRPC para executar os 3 cálculos
- [x] Atualizar componente CalculadoraRevisional para chamar API e exibir resultado
- [x] Testar calculadora com dados de exemplo


## Ajustes na Calculadora Revisional
- [x] Considerar apenas parcelas vencidas até a data do cálculo
- [x] Mostrar diferença entre primeira parcela PRICE e MQJS
- [x] Atualizar resultado para exibir novas informações


## Visualização de Evolução de Parcelas
- [x] Criar componente de tabela de parcelas PRICE e MQJS
- [x] Integrar dados de parcelas ao resultado da calculadora
- [x] Adicionar visualização comparativa entre os dois sistemas


## Correção de Fórmulas de Cálculo
- [x] Corrigir fórmula PRICE com a fórmula correta: PMT = PV × [(1+i)^n × i] ÷ [(1+i)^n - 1]
- [x] Corrigir fórmula MQJS com cálculo de FVA e juros simples
- [x] Testar com exemplo do João (R$30.000, 24 meses, 2% a.m. = R$1.586,13)

## Implementação da Função PGTO
- [x] Aplicar função PGTO (equivalente ao Excel) para cálculo PRICE

## Correção do Cálculo MQJS
- [x] Corrigir cálculo MQJS para usar a fórmula correta do Excel


## Correção do Cálculo PRICE
- [x] Corrigir PRICE para recalcular parcela a cada mês com base no saldo devedor e parcelas restantes


## Integração com Excel PRICE
- [x] Analisar estrutura do Excel PRICE
- [x] Remover cálculo PRICE do código
- [x] Criar função para preencher Excel com dados do cliente
- [x] Integrar geração de Excel ao backend
- [x] Atualizar calculadora para usar Excel gerado


## Simplificação - Apenas PRICE
- [x] Remover cálculos MQJS e correção monetária
- [x] Simplificar CalculadoraRevisional para apenas PRICE
- [x] Atualizar backend para retornar apenas parcelas PRICE
- [x] Atualizar TabelaParcelas para mostrar apenas PRICE


## Exportação de Resultados
- [x] Adicionar botão para exportar tabela de parcelas em Excel

## Correção de Bugs
- [x] Corrigir erro de não exibir resultado do cálculo com tabela de parcelas

## Integração com Planilha do Cliente
- [x] Remover todos os cálculos locais (PRICE, MQJS, correção monetária)
- [x] Importar planilha calculadora-INCC-PRICE.xlsx do cliente
- [x] Atualizar excel-calculator.ts para usar a planilha do cliente
- [x] Configurar preenchimento de parâmetros na planilha do cliente
- [x] Extrair resultados calculados da planilha

## Debug - Cálculos Zerados
- [x] Diagnosticar por que os resultados aparecem zerados
- [x] Corrigir mapeamento de células da planilha
- [x] Testar integração com dados de exemplo
- [x] Implementar cálculo manual PRICE sem dependência de Excel

## Correções Finais
- [x] Corrigir vencimento das parcelas (aparecendo 1 dia a menos)
- [x] Adicionar saldo devedor à tabela de parcelas

## Debug - Taxa Mensal
- [x] Diagnosticar por que taxa mensal gera resultado diferente
- [x] Corrigir cálculo quando taxa mensal é preenchida diretamente

## Implementação do Cálculo MQJS
- [x] Analisar estrutura da planilha MQJS
- [x] Implementar cálculo MQJS no backend
- [x] Integrar MQJS ao frontend (segunda tabela de parcelas)
- [x] Testar cálculo MQJS com dados de exemplo

## Correção Monetária das Parcelas
- [x] Criar tabelas de índices (INCC, IPCA) no banco de dados
- [x] Importar 11.504 registros de índices diários (2010-2025)
- [x] Implementar cálculo de correção monetária (data contrato até vencimento de cada parcela)
- [x] Adicionar campos de índice e correção às tabelas de parcelas
- [x] Integrar seleção de índice ao frontend
- [x] Testar correção com dados de exemplo

## Debug - Correção Monetária
- [x] Corrigir erro "Índice IPCA não encontrado" (problema em getDailyIndex)
- [x] Verificar datas dos índices no banco de dados (11.504 registros OK)
- [x] Aplicar correção apenas em parcelas futuras
- [x] Retornar null se índice não for encontrado (sem erro)

## Parcelas Vencidas
- [x] Aplicar correção monetária APENAS a parcelas vencidas (com vencimento anterior à data atual)
- [x] Não corrigir parcelas futuras
- [x] Se não encontrar índice, manter valor original
- [x] Destacar parcelas vencidas na tabela com fundo cinza e rótulo

## Exibição de Índices e Correção
- [x] Mostrar índice acumulado de cada parcela
- [x] Mostrar valor da correção de cada parcela
- [x] Mostrar percentual de correção
- [x] Atualizar tabela com novos campos
- [x] Adicionar resumo de correção total

## Exibição de Valores Original e Corrigido
- [x] Mostrar valor original da parcela
- [x] Mostrar valor corrigido da parcela
- [x] Exibir lado a lado para comparação
- [x] Atualizar resumo com totais original e corrigido

## Ajuste de Lógica de Correção Monetária
- [x] Usar índices acumulados do Último dia do mês anterior
- [x] Buscar índice do Último dia do mês anterior ao vencimento
- [x] Aplicar mesma fórmula do Excel: Percentual = (Índice Fim / Índice Início) - 1

## Correção Monetária - FINALIZADO
- [x] Usar índices de MESES CONSECUTIVOS (não acumulado desde contrato)
- [x] Buscar índice do último dia do mês anterior ao vencimento
- [x] Buscar índice do último dia do mês anterior ao anterior
- [x] Validar que cálculos correspondem exatamente ao Excel (0.56%, 0.42%, 0.83%)

## Tabela Comparativa
- [x] Criar componente TabelaComparativa para mostrar diferenças PRICE vs MQJS
- [x] Corrigir erro de carregamento infinito (usar tRPC ao invés de fetch)
- [x] Implementar cálculo de diferença corrigida até data atual
- [x] Exibir apenas parcelas pagas (baseado em "Quantidade de Parcelas Pagas")
- [x] Aplicar correção monetária da diferença desde vencimento até hoje

## Redirecionamento de Botões
- [x] Implementar redirecionamento do botão "Agendar Consulta" para seção de contato (#contato)
- [x] Implementar redirecionamento do botão "Solicitar Revisão" para calculadora (#calculadora)
- [x] Testar navegação dos botões
- [x] Validar que ambos os botões funcionam corretamente

## Alterações no Fluxo de Contratação (Nova Sessão)
- [x] Alterar botão "Continuar para Pagamento" para "Contratar" na página de contratação
- [ ] Desativar página de pagamento por tempo indeterminado
- [x] Redirecionar botão "Contratar" para página /sucesso
- [x] Adicionar item "Nossa equipe entrará em contato com você em 48 horas" na página de sucesso
- [x] Remover título "Pagamento Confirmado!" da página de sucesso
- [ ] Testar fluxo completo de contratação


## Sistema de Notificações por E-mail (Google Workspace OAuth2)
- [x] Preparar credenciais OAuth2 e variáveis de ambiente
- [x] Criar endpoint de envio de e-mail no backend
- [x] Integrar notificações no formulário de contato
- [x] Criar componente ClientDataForm para calculadora
- [ ] Integrar notificações na calculadora (finalizar)
- [ ] Testar sistema de notificações
- [ ] Fazer deploy e verificar funcionamento

### Informações de Configuração
- Email para enviar notificações: `contato@silvarepolho.com.br`
- Email para receber notificações: `jhony@silvarepolho.com.br`
- OAuth2 Client ID: `311935838575-kome2ucjjg142sbrf8n03es07jngl7l6.apps.googleusercontent.com`
- OAuth2 Client Secret: `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`
