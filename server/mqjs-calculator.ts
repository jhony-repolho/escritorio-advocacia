export interface ParcelaInfo {
  numero: number;
  dataVencimento: string;
  juros: number;
  amortizacao: number;
  valor: number;
  saldo: number;
}

/**
 * Calcula as parcelas MQJS (Método de Juros Simples com limite de 1% a.m.)
 * 
 * Fórmula MQJS:
 * 1. Calcular FVA (Fator de Valor Atual) para cada parcela: FVA = 1 / (1 + taxa_mensal * numero_parcela)
 * 2. Somar todos os FVAs
 * 3. Parcela = Valor Financiado / Soma dos FVAs
 * 4. Amortização = FVA * Parcela
 * 5. Juros = Parcela - Amortização
 * 6. Saldo = Saldo anterior - Amortização
 */
export async function calcularMQJSComExcel(
  valorImovel: number,
  entrada: number,
  taxaJuros: number,
  quantidadeParcelas: number,
  dataContrato: string,
  dataPrimeiraParcela: string,
  ehTaxaAnual: boolean = true
): Promise<ParcelaInfo[]> {
  // Calcular valor financiado
  const valorFinanciado = valorImovel - entrada;
  
  // Converter taxa para mensal se necessário
  let taxaMensal: number;
  if (ehTaxaAnual) {
    // Se for taxa anual, dividir por 12 para obter taxa mensal
    taxaMensal = taxaJuros / 12;
  } else {
    // Se for taxa mensal, usar diretamente
    taxaMensal = taxaJuros;
  }
  
  // Limitar taxa mensal a 1% (0.01) conforme regra MQJS
  if (taxaMensal > 0.01) {
    taxaMensal = 0.01;
  }
  
  // Data da primeira parcela
  const dataPrimeira = new Date(dataPrimeiraParcela);
  
  // Array para armazenar as parcelas
  const parcelas: ParcelaInfo[] = [];
  
  // Passo 1: Calcular FVA para cada parcela e somar
  const fvas: number[] = [];
  let somaFVAs = 0;
  
  for (let i = 1; i <= quantidadeParcelas; i++) {
    // FVA = 1 / (1 + taxa_mensal * numero_parcela)
    const fva = 1 / (1 + taxaMensal * i);
    fvas.push(fva);
    somaFVAs += fva;
  }
  
  // Passo 2: Calcular valor da parcela (fixo para todas)
  const valorParcela = valorFinanciado / somaFVAs;
  
  // Passo 3: Calcular cada parcela
  let saldoDevedor = valorFinanciado;
  
  for (let i = 1; i <= quantidadeParcelas; i++) {
    const fva = fvas[i - 1];
    
    // Amortização = FVA * Parcela
    const amortizacao = fva * valorParcela;
    
    // Juros = Parcela - Amortização
    const juros = valorParcela - amortizacao;
    
    // Novo saldo devedor
    const novoSaldo = saldoDevedor - amortizacao;
    
    // Calcular data de vencimento (adicionar i-1 meses à data da primeira parcela)
    const dataVencimento = new Date(dataPrimeira);
    dataVencimento.setMonth(dataVencimento.getMonth() + i - 1);
    
    // Adicionar parcela ao array
    parcelas.push({
      numero: i,
      dataVencimento: dataVencimento.toISOString().split('T')[0],
      juros: Math.round(juros * 100) / 100,
      amortizacao: Math.round(amortizacao * 100) / 100,
      valor: Math.round(valorParcela * 100) / 100,
      saldo: Math.round(novoSaldo * 100) / 100,
    });
    
    // Atualizar saldo devedor para próxima iteração
    saldoDevedor = novoSaldo;
  }
  
  return parcelas;
}
