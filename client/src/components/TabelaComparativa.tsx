import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ParcelaInfo {
  numero: number;
  dataVencimento: string;
  juros: number;
  amortizacao: number;
  valor: number;
  saldo: number;
}

interface TabelaComparativaProps {
  parcelasPrice: ParcelaInfo[];
  parcelasMQJS: ParcelaInfo[];
  quantidadeParcelasPagas?: number;
  indiceCorrecao?: "INCC" | "IPCA";
}

export default function TabelaComparativa({
  parcelasPrice,
  parcelasMQJS,
  quantidadeParcelasPagas = 0,
  indiceCorrecao,
}: TabelaComparativaProps) {
  const [totalDiferenca, setTotalDiferenca] = useState<number>(0);
  const [proximaParcela, setProximaParcela] = useState<ParcelaInfo | null>(null);

  useEffect(() => {
    // Calcular total de diferença das parcelas pagas
    let total = 0;
    const parcelasParaMostrar = quantidadeParcelasPagas > 0 
      ? Math.min(quantidadeParcelasPagas, parcelasPrice.length)
      : parcelasPrice.length;

    for (let idx = 0; idx < parcelasParaMostrar; idx++) {
      const price = parcelasPrice[idx];
      const mqjs = parcelasMQJS[idx];

      if (!price || !mqjs) continue;

      const diferencaParcela = price.valor - mqjs.valor;
      total += diferencaParcela;
    }

    setTotalDiferenca(total);

    // Encontrar próxima parcela MQJS após as parcelas pagas
    if (quantidadeParcelasPagas > 0 && quantidadeParcelasPagas < parcelasMQJS.length) {
      setProximaParcela(parcelasMQJS[quantidadeParcelasPagas]);
    } else if (quantidadeParcelasPagas === 0 && parcelasMQJS.length > 0) {
      // Se nenhuma parcela foi paga, mostrar a primeira parcela
      setProximaParcela(parcelasMQJS[0]);
    }
  }, [parcelasPrice, parcelasMQJS, quantidadeParcelasPagas]);

  // Formatar data para DD/MM/YYYY
  const formatarData = (data: string): string => {
    try {
      const [ano, mes, dia] = data.split('-');
      return `${dia}/${mes}/${ano}`;
    } catch {
      return data;
    }
  };

  return (
    <div className="space-y-6">
      {/* Card principal com resumo */}
      <Card className="p-8 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <div className="space-y-6">


          {/* Ressarcimento */}
          <div className="bg-white rounded-lg p-6 border-l-4 border-green-500">
            <p className="text-gray-700 text-sm mb-2">
              Com base nas parcelas pagas:
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-green-600">
                R$ {totalDiferenca.toFixed(2)}
              </span>
              <span className="text-gray-600">
                Você tem direito a um ressarcimento
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-3 flex items-start gap-2">
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
              <span>
                Este valor será atualizado monetariamente de acordo com o índice de correção selecionado
                {indiceCorrecao && ` (${indiceCorrecao})`}
              </span>
            </p>
          </div>

          {/* Revisão da 1ª parcela */}
          {parcelasMQJS.length > 0 && (
            <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500">
              <p className="text-gray-700 text-sm mb-3">
                <strong>Sua 1ª parcela deve ser revisada para:</strong>
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-green-600">
                  R$ {parcelasMQJS[0].valor.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Botão para iniciar processo */}
          <div className="flex gap-4">
            <a
              href="/contratacao"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
            >
              Iniciar o processo judicial de revisão do meu contrato
            </a>
          </div>

        </div>
      </Card>
    </div>
  );
}
