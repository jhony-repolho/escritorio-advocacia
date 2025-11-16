import { useState } from "react";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

interface ParcelaInfo {
  numero: number;
  dataVencimento: string;
  juros: number;
  amortizacao: number;
  valor: number;
  saldo: number;
  estaVencida?: boolean;
  indiceCorrecao?: string;
  indiceAcumulado?: number;
  percentualCorrecao?: number; // Percentual acumulado
  valorCorrecao?: number; // Percentual com 2 casas decimais
  valorParcelaCorrigida?: number;
  valorJurosCorrigido?: number;
  valorAmortizacaoCorrigida?: number;
}

interface TabelaParcellasProps {
  parcelas: ParcelaInfo[];
  titulo?: string;
}

export default function TabelaParcelas({
  parcelas,
  titulo = "Evolução das Parcelas - Sistema PRICE",
}: TabelaParcellasProps) {
  const [expandido, setExpandido] = useState(false);
  const [filtroMeses, setFiltroMeses] = useState(12);

  const parcelasExibidas = parcelas.slice(0, filtroMeses);

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatarData = (data: string) => {
    // Dividir a string "YYYY-MM-DD" e criar data sem problemas de fuso horário
    const [ano, mes, dia] = data.split("-").map(Number);
    return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR");
  };

  const totalJuros = parcelas.reduce((acc, p) => acc + p.juros, 0);
  const totalAmortizacao = parcelas.reduce((acc, p) => acc + p.amortizacao, 0);
  const totalPago = parcelas.reduce((acc, p) => acc + p.valor, 0);
  const totalPagoCorrigido = parcelas.reduce((acc, p) => acc + (p.valorParcelaCorrigida && p.estaVencida ? p.valorParcelaCorrigida : p.valor), 0);
  const totalCorrecao = parcelas.reduce((acc, p) => {
    if (p.estaVencida && p.valorParcelaCorrigida) {
      return acc + (p.valorParcelaCorrigida - p.valor);
    }
    return acc;
  }, 0);

  const temCorrecao = parcelas.some(p => p.indiceAcumulado !== undefined);

  const exportarExcel = () => {
    // Preparar dados para exportação
    const dados = parcelas.map((parcela) => {
      const row: any = {
        "Número da Prestação": parcela.numero,
        "Vencimento": formatarData(parcela.dataVencimento),
        "Juros": parcela.juros,
        "Amortização": parcela.amortizacao,
        "Valor Original": parcela.valor,
        "Valor Corrigido": parcela.valorParcelaCorrigida && parcela.estaVencida ? parcela.valorParcelaCorrigida : parcela.valor,
        "Saldo Devedor": parcela.saldo,
      };

      // Adicionar colunas de correção se existirem
      if (parcela.indiceAcumulado !== undefined) {
        row["Índice Acumulado"] = parcela.indiceAcumulado?.toFixed(10);
        row["% Correção Acumulada"] = parcela.valorCorrecao?.toFixed(2);
      }

      return row;
    });

    // Adicionar linha de totais
    const totalRow: any = {
      "Número da Prestação": "TOTAL",
      "Vencimento": "",
      "Juros": totalJuros,
      "Amortização": totalAmortizacao,
      "Valor Original": totalPago,
      "Valor Corrigido": totalPagoCorrigido,
      "Saldo Devedor": "",
    };

    if (temCorrecao) {
      totalRow["Índice Acumulado"] = "";
      totalRow["% Correção Acumulada"] = "";
    }

    (dados as any).push(totalRow);

    // Criar workbook
    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Parcelas");

    // Ajustar largura das colunas
    const colWidths = [
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 20 },
      { wch: 12 },
      { wch: 15 },
    ];
    ws["!cols"] = colWidths;

    // Fazer download
    const nomeArquivo = `Parcelas_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, nomeArquivo);
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{titulo}</CardTitle>
          <div className="flex gap-2">
            {expandido && (
              <Button
                onClick={exportarExcel}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Exportar Excel
              </Button>
            )}
            <button
              onClick={() => setExpandido(!expandido)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              {expandido ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
      </CardHeader>

      {expandido && (
        <CardContent className="space-y-4">
          {/* Filtro de períodos */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFiltroMeses(6)}
              className={`px-3 py-1 rounded text-sm ${
                filtroMeses === 6
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              6 meses
            </button>
            <button
              onClick={() => setFiltroMeses(12)}
              className={`px-3 py-1 rounded text-sm ${
                filtroMeses === 12
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              12 meses
            </button>
            <button
              onClick={() => setFiltroMeses(24)}
              className={`px-3 py-1 rounded text-sm ${
                filtroMeses === 24
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              24 meses
            </button>
            <button
              onClick={() => setFiltroMeses(60)}
              className={`px-3 py-1 rounded text-sm ${
                filtroMeses === 60
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              60 meses
            </button>
            <button
              onClick={() => setFiltroMeses(parcelas.length)}
              className={`px-3 py-1 rounded text-sm ${
                filtroMeses === parcelas.length
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Todas
            </button>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white border-b">
                  <th className="px-4 py-2 text-left">Número da Prestação</th>
                  <th className="px-4 py-2 text-left">Vencimento</th>
                  <th className="px-4 py-2 text-right">Juros</th>
                  <th className="px-4 py-2 text-right">Amortização</th>
                  <th className="px-4 py-2 text-right">Valor Original</th>
                  <th className="px-4 py-2 text-right">Valor Corrigido</th>
                  <th className="px-4 py-2 text-right">Saldo Devedor</th>
                  {temCorrecao && (
                    <>
                      <th className="px-4 py-2 text-right">Índice Acumulado</th>
                      <th className="px-4 py-2 text-right">% Correção Acumulada</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {parcelasExibidas.map((parcela, idx) => {
                  const isVencida = parcela.estaVencida;
                  const rowClass = isVencida ? "bg-gray-100" : "hover:bg-gray-50";
                  
                  return (
                    <tr key={idx} className={`border-b ${rowClass}`}>
                      <td className="px-4 py-2 font-semibold">{parcela.numero}</td>
                      <td className="px-4 py-2">
                        {formatarData(parcela.dataVencimento)}
                      </td>
                      <td className="px-4 py-2 text-right text-red-600 font-medium">
                        {formatarMoeda(parcela.juros)}
                      </td>
                      <td className="px-4 py-2 text-right text-green-600 font-medium">
                        {formatarMoeda(parcela.amortizacao)}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold text-blue-600">
                        {formatarMoeda(parcela.valor)}
                      </td>
                      <td className="px-4 py-2 text-right font-bold text-purple-600">
                        {parcela.valorParcelaCorrigida && isVencida
                          ? formatarMoeda(parcela.valorParcelaCorrigida)
                          : formatarMoeda(parcela.valor)}
                      </td>
                      <td className="px-4 py-2 text-right font-medium text-gray-700">
                        {formatarMoeda(parcela.saldo)}
                      </td>
                      {temCorrecao && (
                        <>
                          <td className="px-4 py-2 text-right text-sm text-gray-600">
                            {parcela.indiceAcumulado?.toFixed(10)}
                          </td>
                          <td className="px-4 py-2 text-right text-sm font-semibold text-orange-600">
                            {parcela.valorCorrecao?.toFixed(2)}%
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Resumo */}
          <div className="grid grid-cols-5 gap-4 pt-4 border-t bg-gray-50 p-4 rounded">
            <div className="text-center">
              <p className="text-gray-600 text-sm font-semibold">Total de Juros</p>
              <p className="text-lg font-bold text-red-600">
                {formatarMoeda(totalJuros)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm font-semibold">Total Amortizado</p>
              <p className="text-lg font-bold text-green-600">
                {formatarMoeda(totalAmortizacao)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm font-semibold">Total Original</p>
              <p className="text-lg font-bold text-blue-600">
                {formatarMoeda(totalPago)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm font-semibold">Total Corrigido</p>
              <p className="text-lg font-bold text-purple-600">
                {formatarMoeda(totalPagoCorrigido)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm font-semibold">Parcelas Exibidas</p>
              <p className="text-lg font-bold">
                {parcelasExibidas.length} de {parcelas.length}
              </p>
            </div>
          </div>

          {/* Resumo de Correção se houver */}
          {totalCorrecao > 0 && (
            <div className="grid grid-cols-2 gap-4 pt-4 bg-orange-50 p-4 rounded border border-orange-200">
              <div className="text-center">
                <p className="text-gray-600 text-sm font-semibold">Total de Correção</p>
                <p className="text-lg font-bold text-orange-600">
                  {formatarMoeda(totalCorrecao)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm font-semibold">Parcelas Corrigidas</p>
                <p className="text-lg font-bold">
                  {parcelas.filter(p => p.indiceAcumulado !== undefined).length}
                </p>
              </div>
            </div>
          )}

          {/* Botão de exportação alternativo */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={exportarExcel}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Download size={18} />
              Exportar Tabela em Excel
            </Button>
          </div>


        </CardContent>
      )}
    </Card>
  );
}
