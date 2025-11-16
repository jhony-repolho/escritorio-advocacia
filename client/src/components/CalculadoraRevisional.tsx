import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import TabelaParcelas from "./TabelaParcelas";
import TabelaComparativa from "./TabelaComparativa";
import { trpc } from "@/lib/trpc";

const calculadoraSchema = z.object({
  valorImovel: z.string().min(1, "Campo obrigatório"),
  entrada: z.string().min(1, "Campo obrigatório"),
  taxaJuros: z.string().min(1, "Campo obrigatório"),
  tipoTaxa: z.enum(["mensal", "anual"]),
  quantidadeParcelas: z.string().min(1, "Campo obrigatório"),
  vencimentoParcela: z.string().min(1, "Campo obrigatório"),
  dataContrato: z.string().min(1, "Campo obrigatório"),
  indiceCorrecao: z.enum(["INCC", "IPCA", "nenhum"]).optional(),
  quantidadeParcelasPagas: z.string().optional(),
});

type CalculadoraData = z.infer<typeof calculadoraSchema>;

interface ParcelaInfo {
  numero: number;
  dataVencimento: string;
  juros: number;
  amortizacao: number;
  valor: number;
  saldo: number;
  indiceCorrecao?: string;
  fatorCorrecao?: number;
  percentualCorrecao?: number;
  valorCorrigido?: number;
  jurosCorrigidos?: number;
  amortizacaoCorrigida?: number;
}

interface ResultadoCalculadora {
  parcelas: ParcelaInfo[];
}

export default function CalculadoraRevisional() {
  const [resultado, setResultado] = useState<ResultadoCalculadora | null>(null);
  const [resultadoMQJS, setResultadoMQJS] = useState<ResultadoCalculadora | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [queryParams, setQueryParams] = useState<any | null>(null);
  
  const { mutate: calcularPrice, isPending: isPendingPrice } = trpc.calculadora.calcular.useMutation({
    onSuccess: (data) => {
      console.log("DEBUG: Sucesso PRICE:", data);
      setResultado(data);
    },
    onError: (error) => {
      console.error("DEBUG: Erro PRICE:", error);
      toast.error("Erro ao calcular PRICE. Verifique os dados e tente novamente.");
      setIsLoading(false);
    }
  });

  const { mutate: calcularMQJS, isPending: isPendingMQJS } = trpc.calculadora.calcularMQJS.useMutation({
    onSuccess: (data) => {
      console.log("DEBUG: Sucesso MQJS:", data);
      setResultadoMQJS(data);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("DEBUG: Erro MQJS:", error);
      toast.error("Erro ao calcular MQJS. Verifique os dados e tente novamente.");
      setIsLoading(false);
    }
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CalculadoraData>({
    resolver: zodResolver(calculadoraSchema),
    defaultValues: {
      tipoTaxa: "anual",
      quantidadeParcelas: "240",
      indiceCorrecao: "nenhum",
    },
  });

  const valorImovelWatch = watch("valorImovel");
  const entradaWatch = watch("entrada");

  const onSubmit = async (data: CalculadoraData) => {
    try {
      setIsLoading(true);
      setResultado(null);
      setResultadoMQJS(null);

      const valorImovel = parseFloat(data.valorImovel);
      const entrada = parseFloat(data.entrada);
      const taxaJuros = parseFloat(data.taxaJuros);
      const quantidadeParcelas = parseInt(data.quantidadeParcelas);
      const ehTaxaAnual = data.tipoTaxa === "anual";

      // Validações
      if (isNaN(valorImovel) || valorImovel <= 0) {
        toast.error("Valor do imóvel deve ser maior que zero");
        setIsLoading(false);
        return;
      }

      if (isNaN(entrada) || entrada < 0) {
        toast.error("Entrada deve ser maior ou igual a zero");
        setIsLoading(false);
        return;
      }

      if (isNaN(taxaJuros) || taxaJuros <= 0) {
        toast.error("Taxa de juros deve ser maior que zero");
        setIsLoading(false);
        return;
      }

      if (quantidadeParcelas <= 0) {
        toast.error("Quantidade de parcelas deve ser maior que zero");
        setIsLoading(false);
        return;
      }

      const valorFinanciado = valorImovel - entrada;
      if (valorFinanciado <= 0) {
        toast.error("Valor financiado deve ser maior que zero");
        setIsLoading(false);
        return;
      }

      // Chamar API tRPC com taxa em decimal (ex: 0.14 para 14%)
      const taxaDecimal = taxaJuros / 100;
      const indiceCorrecao = data.indiceCorrecao && data.indiceCorrecao !== "nenhum" 
        ? (data.indiceCorrecao as "INCC" | "IPCA")
        : undefined;
      
      const params = {
        valorImovel,
        entrada,
        taxaJuros: taxaDecimal,
        ehTaxaAnual,
        quantidadeParcelas,
        dataContrato: data.dataContrato,
        dataPrimeiraParcela: data.vencimentoParcela,
        indiceCorrecao,
      };
      console.log("DEBUG: Enviando params para mutations:", params);
      setQueryParams(params);
      
      // Chamar mutations
      calcularPrice(params);
      calcularMQJS(params);
    } catch (error) {
      console.error("Erro ao calcular:", error);
      toast.error("Erro ao realizar cálculo. Tente novamente.");
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calculadora Revisional de Imóvel</CardTitle>
          <CardDescription>
            Preencha os dados do seu financiamento para calcular a revisão
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valorImovel">Valor do Imóvel (R$)</Label>
                <Input
                  id="valorImovel"
                  type="number"
                  step="0.01"
                  placeholder="300000.00"
                  {...register("valorImovel")}
                  className={errors.valorImovel ? "border-red-500" : ""}
                />
                {errors.valorImovel && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.valorImovel.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="entrada">Entrada (R$)</Label>
                <Input
                  id="entrada"
                  type="number"
                  step="0.01"
                  placeholder="60000.00"
                  {...register("entrada")}
                  className={errors.entrada ? "border-red-500" : ""}
                />
                {errors.entrada && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.entrada.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="taxaJuros">Taxa de Juros (%)</Label>
                <Input
                  id="taxaJuros"
                  type="number"
                  step="0.01"
                  placeholder="14.00"
                  {...register("taxaJuros")}
                  className={errors.taxaJuros ? "border-red-500" : ""}
                />
                {errors.taxaJuros && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.taxaJuros.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="tipoTaxa">Tipo de Taxa</Label>
                <select
                  id="tipoTaxa"
                  {...register("tipoTaxa")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="anual">Anual</option>
                  <option value="mensal">Mensal</option>
                </select>
              </div>

              <div>
                <Label htmlFor="quantidadeParcelas">Quantidade de Parcelas</Label>
                <Input
                  id="quantidadeParcelas"
                  type="number"
                  step="1"
                  placeholder="240"
                  {...register("quantidadeParcelas")}
                  className={errors.quantidadeParcelas ? "border-red-500" : ""}
                />
                {errors.quantidadeParcelas && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.quantidadeParcelas.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="vencimentoParcela">Data de Vencimento da 1ª Parcela</Label>
                <Input
                  id="vencimentoParcela"
                  type="date"
                  {...register("vencimentoParcela")}
                  className={errors.vencimentoParcela ? "border-red-500" : ""}
                />
                {errors.vencimentoParcela && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.vencimentoParcela.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="indiceCorrecao">Índice de Correção (Opcional)</Label>
                <select
                  id="indiceCorrecao"
                  {...register("indiceCorrecao")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="nenhum">Nenhum</option>
                  <option value="INCC">INCC</option>
                  <option value="IPCA">IPCA</option>
                </select>
              </div>

              <div>
                <Label htmlFor="dataContrato">Data de Assinatura do Contrato</Label>
                <Input
                  id="dataContrato"
                  type="date"
                  {...register("dataContrato")}
                  className={errors.dataContrato ? "border-red-500" : ""}
                />
                {errors.dataContrato && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dataContrato.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="quantidadeParcelasPagas">Quantidade de Parcelas Pagas (Opcional)</Label>
                <Input
                  id="quantidadeParcelasPagas"
                  type="number"
                  step="1"
                  placeholder="0"
                  {...register("quantidadeParcelasPagas")}
                  className=""
                />
                <p className="text-gray-500 text-xs mt-1">
                  Deixe em branco ou 0 para calcular todas as parcelas
                </p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || isPendingPrice || isPendingMQJS}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading || isPendingPrice || isPendingMQJS ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculando...
                </>
              ) : (
                "Calcular Revisão"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tabelas PRICE e MQJS ocultas para o cliente */}

      {resultado && resultadoMQJS && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <TabelaComparativa 
              parcelasPrice={resultado.parcelas} 
              parcelasMQJS={resultadoMQJS.parcelas}
              quantidadeParcelasPagas={queryParams?.quantidadeParcelasPagas}
              indiceCorrecao={queryParams?.indiceCorrecao}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
