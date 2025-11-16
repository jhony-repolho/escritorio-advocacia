export interface ParcelaInfo {
  numero: number;
  dataVencimento: string;
  juros: number;
  amortizacao: number;
  valor: number;
  saldo: number;
}

/**
 * Calcula a parcela mensal usando a fórmula PMT do Excel
 * PMT = PV × [(1+i)^n × i] ÷ [(1+i)^n - 1]
 * 
 * @param taxa Taxa mensal de juros (decimal, ex: 0.01 para 1%)
 * @param nParcelas Número de parcelas restantes (incluindo a atual)
 * @param saldoDevedor Saldo devedor atual
 * @returns Valor da parcela
 */
function calcularPMT(taxa: number, nParcelas: number, saldoDevedor: number): number {
  if (taxa === 0) {
    return saldoDevedor / nParcelas;
  }
  
  const numerador = saldoDevedor * Math.pow(1 + taxa, nParcelas) * taxa;
  const denominador = Math.pow(1 + taxa, nParcelas) - 1;
  
  return numerador / denominador;
}

/**
 * Calcula as parcelas PRICE usando cálculo manual
 * Não depende de arquivo Excel, apenas dos parâmetros de entrada
 * 
 * Usa a mesma lógica do Excel:
 * - PMT($D$13, ($D$16 - G_anterior), -$K$2)
 * - Onde G_anterior é o número da parcela anterior (0 para a primeira)
 */
export async function calcularPriceComExcel(
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
    // Se for taxa anual, converter para mensal
    taxaMensal = Math.pow(1 + taxaJuros, 1 / 12) - 1;
  } else {
    // Se for taxa mensal, usar diretamente
    taxaMensal = taxaJuros;
  }
  
  // Data da primeira parcela
  const dataPrimeira = new Date(dataPrimeiraParcela);
  
  // Array para armazenar as parcelas
  const parcelas: ParcelaInfo[] = [];
  
  // Saldo devedor inicial
  let saldoDevedor = valorFinanciado;
  
  // Calcular cada parcela
  for (let i = 1; i <= quantidadeParcelas; i++) {
    // Número de parcelas restantes usando a mesma lógica do Excel
    // Na linha 3 (parcela 1): G2=0, então D16-G2 = 96-0 = 96
    // Na linha 4 (parcela 2): G3=1, então D16-G3 = 96-1 = 95
    // Na linha 5 (parcela 3): G4=2, então D16-G4 = 96-2 = 94
    const parcelasRestantes = quantidadeParcelas - (i - 1);
    
    // Calcular valor da parcela usando PMT
    const valorParcela = calcularPMT(taxaMensal, parcelasRestantes, saldoDevedor);
    
    // Calcular juros
    const juros = saldoDevedor * taxaMensal;
    
    // Calcular amortização
    const amortizacao = valorParcela - juros;
    
    // Calcular novo saldo devedor
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
