import { calcularPriceComExcel } from './excel-calculator';
import { getDb } from './db';
import { calcularMQJSComExcel } from './mqjs-calculator';
import { getDailyIndex } from './db';

export interface ParcelaInfo {
  numero: number;
  dataVencimento: string;
  juros: number;
  amortizacao: number;
  valor: number;
  saldo: number;
}

export interface ParcelaComCorrecao extends ParcelaInfo {
  indiceCorrecao?: string;
  indiceAcumulado?: number;
  percentualCorrecao?: number; // Percentual acumulado
  valorCorrecao?: number; // Percentual com 2 casas decimais
  valorParcelaCorrigida?: number;
  valorJurosCorrigido?: number;
  valorAmortizacaoCorrigida?: number;
  estaVencida?: boolean;
}

export interface ResultadoCalculadora {
  parcelas: ParcelaComCorrecao[];
}

/**
 * Calcula as parcelas usando o sistema PRICE (Excel) com correção mensal acumulativa
 */
export async function calcularPrice(
  valorImovel: number,
  entrada: number,
  taxaJuros: number,
  quantidadeParcelas: number,
  dataContrato: string,
  dataPrimeiraParcela: string,
  ehTaxaAnual: boolean = true,
  indiceCorrecao?: "INCC" | "IPCA"
): Promise<ParcelaComCorrecao[]> {
  const parcelasExcel = await calcularPriceComExcel(
    valorImovel,
    entrada,
    taxaJuros,
    quantidadeParcelas,
    dataContrato,
    dataPrimeiraParcela,
    ehTaxaAnual
  );
  
  // Se não houver índice de correção, retornar sem correção
  if (!indiceCorrecao) {
    return parcelasExcel.map(p => ({
      numero: p.numero,
      dataVencimento: p.dataVencimento,
      juros: p.juros,
      amortizacao: p.amortizacao,
      valor: p.valor,
      saldo: p.saldo,
    }));
  }
  
  // Aplicar correção monetária mensal acumulativa
  let percentualAcumulado = 0;
  const parcelasComCorrecao: ParcelaComCorrecao[] = [];

  for (let i = 0; i < parcelasExcel.length; i++) {
    const parcela = parcelasExcel[i];
    
    // Verificar se está vencida
    const hoje = new Date();
    const dataVencimentoDate = new Date(parcela.dataVencimento + 'T00:00:00Z');
    const estaVencida = dataVencimentoDate < hoje;

    let parcelaCorrigida: ParcelaComCorrecao = {
      numero: parcela.numero,
      dataVencimento: parcela.dataVencimento,
      juros: parcela.juros,
      amortizacao: parcela.amortizacao,
      valor: parcela.valor,
      saldo: parcela.saldo,
      indiceCorrecao,
      estaVencida,
    };

    // Se estiver vencida, buscar índices para calcular correção
    if (estaVencida) {
      const [anoVenc, mesVenc, diaVenc] = parcela.dataVencimento.split('-').map(Number);

      // Último dia do mês de vencimento
      const ultimoDiaDoMes = new Date(anoVenc, mesVenc, 0).getDate();
      const dataUltimoDiaMesFim = `${anoVenc}-${String(mesVenc).padStart(2, '0')}-${String(ultimoDiaDoMes).padStart(2, '0')}`;

      // Último dia do mês anterior
      let mesAnterior = mesVenc - 1;
      let anoAnterior = anoVenc;
      if (mesAnterior === 0) {
        mesAnterior = 12;
        anoAnterior = anoVenc - 1;
      }

      const ultimoDiaDoMesAnterior = new Date(anoAnterior, mesAnterior, 0).getDate();
      const dataUltimoDiaMesAnterior = `${anoAnterior}-${String(mesAnterior).padStart(2, '0')}-${String(ultimoDiaDoMesAnterior).padStart(2, '0')}`;

      // Buscar índices
      const indiceFim = await getDailyIndex(indiceCorrecao, dataUltimoDiaMesFim);
      const indiceInicio = await getDailyIndex(indiceCorrecao, dataUltimoDiaMesAnterior);

      // Se encontrar os índices, calcular percentual mensal e acumular
      if (indiceFim && indiceInicio) {
        const acumuladoFim = parseFloat(indiceFim.accumulated);
        const acumuladoInicio = parseFloat(indiceInicio.accumulated);

        const percentualMensal = (acumuladoFim / acumuladoInicio) - 1;
        percentualAcumulado += percentualMensal;

        // Aplicar correção à parcela
        // Valor da Correção = Parcela Original × Percentual Acumulado
        // Parcela Corrigida = Parcela Original + Valor da Correção
        parcelaCorrigida.indiceAcumulado = acumuladoFim;
        parcelaCorrigida.percentualCorrecao = percentualAcumulado;
        parcelaCorrigida.valorCorrecao = Math.round(percentualAcumulado * 10000) / 100; // Percentual com 2 casas decimais
        
        // Valor da correção em reais (como no Excel: Parcela × Percentual)
        const valorCorrecaoReaisPrice = Math.round(parcela.valor * percentualAcumulado * 100) / 100;
        parcelaCorrigida.valorParcelaCorrigida = Math.round((parcela.valor + valorCorrecaoReaisPrice) * 100) / 100;
        parcelaCorrigida.valorJurosCorrigido = Math.round(parcela.juros * (1 + percentualAcumulado) * 100) / 100;
        parcelaCorrigida.valorAmortizacaoCorrigida = Math.round(parcela.amortizacao * (1 + percentualAcumulado) * 100) / 100;
      }
    }

    parcelasComCorrecao.push(parcelaCorrigida);
  }

  return parcelasComCorrecao;
}

/**
 * Calcula as parcelas usando o sistema MQJS (Método de Juros Simples) com correção mensal acumulativa
 */
export async function calcularMQJS(
  valorImovel: number,
  entrada: number,
  taxaJuros: number,
  quantidadeParcelas: number,
  dataContrato: string,
  dataPrimeiraParcela: string,
  ehTaxaAnual: boolean = true,
  indiceCorrecao?: "INCC" | "IPCA"
): Promise<ParcelaComCorrecao[]> {
  const parcelasMQJS = await calcularMQJSComExcel(
    valorImovel,
    entrada,
    taxaJuros,
    quantidadeParcelas,
    dataContrato,
    dataPrimeiraParcela,
    ehTaxaAnual
  );
  
  // Se não houver índice de correção, retornar sem correção
  if (!indiceCorrecao) {
    return parcelasMQJS.map(p => ({
      numero: p.numero,
      dataVencimento: p.dataVencimento,
      juros: p.juros,
      amortizacao: p.amortizacao,
      valor: p.valor,
      saldo: p.saldo,
    }));
  }
  
  // Aplicar correção monetária mensal acumulativa
  let percentualAcumulado = 0;
  const parcelasComCorrecao: ParcelaComCorrecao[] = [];

  for (let i = 0; i < parcelasMQJS.length; i++) {
    const parcela = parcelasMQJS[i];
    
    // Verificar se está vencida
    const hoje = new Date();
    const dataVencimentoDate = new Date(parcela.dataVencimento + 'T00:00:00Z');
    const estaVencida = dataVencimentoDate < hoje;

    let parcelaCorrigida: ParcelaComCorrecao = {
      numero: parcela.numero,
      dataVencimento: parcela.dataVencimento,
      juros: parcela.juros,
      amortizacao: parcela.amortizacao,
      valor: parcela.valor,
      saldo: parcela.saldo,
      indiceCorrecao,
      estaVencida,
    };

    // Se estiver vencida, buscar índices para calcular correção
    if (estaVencida) {
      const [anoVenc, mesVenc, diaVenc] = parcela.dataVencimento.split('-').map(Number);

      // Último dia do mês de vencimento
      const ultimoDiaDoMes = new Date(anoVenc, mesVenc, 0).getDate();
      const dataUltimoDiaMesFim = `${anoVenc}-${String(mesVenc).padStart(2, '0')}-${String(ultimoDiaDoMes).padStart(2, '0')}`;

      // Último dia do mês anterior
      let mesAnterior = mesVenc - 1;
      let anoAnterior = anoVenc;
      if (mesAnterior === 0) {
        mesAnterior = 12;
        anoAnterior = anoVenc - 1;
      }

      const ultimoDiaDoMesAnterior = new Date(anoAnterior, mesAnterior, 0).getDate();
      const dataUltimoDiaMesAnterior = `${anoAnterior}-${String(mesAnterior).padStart(2, '0')}-${String(ultimoDiaDoMesAnterior).padStart(2, '0')}`;

      // Buscar índices
      const indiceFim = await getDailyIndex(indiceCorrecao, dataUltimoDiaMesFim);
      const indiceInicio = await getDailyIndex(indiceCorrecao, dataUltimoDiaMesAnterior);

      // Se encontrar os índices, calcular percentual mensal e acumular
      if (indiceFim && indiceInicio) {
        const acumuladoFim = parseFloat(indiceFim.accumulated);
        const acumuladoInicio = parseFloat(indiceInicio.accumulated);

        const percentualMensal = (acumuladoFim / acumuladoInicio) - 1;
        percentualAcumulado += percentualMensal;

        // Aplicar correção à parcela
        // Valor da Correção = Parcela Original × Percentual Acumulado
        // Parcela Corrigida = Parcela Original + Valor da Correção
        parcelaCorrigida.indiceAcumulado = acumuladoFim;
        parcelaCorrigida.percentualCorrecao = percentualAcumulado;
        parcelaCorrigida.valorCorrecao = Math.round(percentualAcumulado * 10000) / 100; // Percentual com 2 casas decimais
        
        // Valor da correção em reais (como no Excel: Parcela × Percentual)
        const valorCorrecaoReaisPrice = Math.round(parcela.valor * percentualAcumulado * 100) / 100;
        parcelaCorrigida.valorParcelaCorrigida = Math.round((parcela.valor + valorCorrecaoReaisPrice) * 100) / 100;
        parcelaCorrigida.valorJurosCorrigido = Math.round(parcela.juros * (1 + percentualAcumulado) * 100) / 100;
        parcelaCorrigida.valorAmortizacaoCorrigida = Math.round(parcela.amortizacao * (1 + percentualAcumulado) * 100) / 100;
      }
    }

    parcelasComCorrecao.push(parcelaCorrigida);
  }

  return parcelasComCorrecao;
}

/**
 * Calcula a diferença entre PRICE e MQJS para parcelas pagas, corrigidas até hoje
 */
export async function calcularDiferencaParcelasPagas(
  parcelasPrice: ParcelaComCorrecao[],
  parcelasMQJS: ParcelaComCorrecao[],
  quantidadeParcelasPagas: number,
  indiceCorrecao?: "INCC" | "IPCA"
): Promise<{
  numero: number;
  dataVencimento: string;
  parcelaPrice: number;
  parcelaMQJS: number;
  diferencaParcela: number;
  percentualDiferenca: number;
}[]> {
  const comparacoes = [];
  const parcelasExibidas = Math.min(quantidadeParcelasPagas || parcelasPrice.length, parcelasPrice.length);

  for (let i = 0; i < parcelasExibidas; i++) {
    const price = parcelasPrice[i];
    const mqjs = parcelasMQJS[i];

    let parcelaPrecoAtualizado = price.valorParcelaCorrigida || price.valor;
    let parcelaMQJSAtualizada = mqjs.valorParcelaCorrigida || mqjs.valor;

    // Índice de correção não está sendo usado nesta versão simplificada

    const diferencaParcela = parcelaPrecoAtualizado - parcelaMQJSAtualizada;
    const percentualDiferenca = parcelaMQJSAtualizada > 0 ? (diferencaParcela / parcelaMQJSAtualizada) * 100 : 0;

    comparacoes.push({
      numero: price.numero,
      dataVencimento: price.dataVencimento,
      parcelaPrice: parcelaPrecoAtualizado,
      parcelaMQJS: parcelaMQJSAtualizada,
      diferencaParcela,
      percentualDiferenca,
    });
  }

  return comparacoes;
}
