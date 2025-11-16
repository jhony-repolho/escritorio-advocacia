import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Upload, X, Download, Check, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface ClienteData {
  nomeCompleto: string;
  nacionalidade?: string;
  profissao?: string;
  estadoCivil?: string;
  rg: string;
  cpf: string;
  endereco: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  estado: string;
  telefone: string;
  email: string;
}

interface Documento {
  tipo: string;
  arquivo: File | null;
  obrigatorio: boolean;
}

export default function ContratacaoDocumentos() {
  const [, setLocation] = useLocation();
  const [clienteData, setClienteData] = useState<ClienteData | null>(null);

  const [documentos, setDocumentos] = useState<Documento[]>([
    { tipo: "Procuração Assinada", arquivo: null, obrigatorio: true },
    { tipo: "Contrato de Prestação de Serviços Assinado", arquivo: null, obrigatorio: true },
    { tipo: "RG/CPF/CNH", arquivo: null, obrigatorio: true },
    { tipo: "Contrato de compra e venda do imóvel", arquivo: null, obrigatorio: true },
    { tipo: "Boletos e comprovantes de pagamentos", arquivo: null, obrigatorio: false },
    { tipo: "Extrato de evolução das parcelas", arquivo: null, obrigatorio: false },
    { tipo: "Outros documentos", arquivo: null, obrigatorio: false },
  ]);

  useEffect(() => {
    // Carregar dados do cliente do localStorage
    const dados = localStorage.getItem("clienteData");
    if (dados) {
      setClienteData(JSON.parse(dados));
    }
  }, []);

  const handleArquivoChange = (index: number, file: File | null) => {
    const novosDocumentos = [...documentos];
    novosDocumentos[index].arquivo = file;
    setDocumentos(novosDocumentos);
  };

  const validarDocumentos = () => {
    const documentosObrigatorios = documentos.filter(d => d.obrigatorio);
    return documentosObrigatorios.every(d => d.arquivo !== null);
  };

  const handleContinuar = () => {
    if (!validarDocumentos()) {
      alert("Por favor, anexe todos os documentos obrigatórios");
      return;
    }

    // Salvar dados completos
    const dadosCompletos = {
      clienteData,
      documentos: documentos.map(d => ({
        tipo: d.tipo,
        nomeArquivo: d.arquivo?.name || null,
        obrigatorio: d.obrigatorio,
      })),
    };
    localStorage.setItem("contratacaoDados", JSON.stringify(dadosCompletos));
    setLocation("/sucesso");
  };

  const handleBaixarProcuracao = () => {
    const link = document.createElement("a");
    link.href = "/procuracao.docx";
    link.download = "Procuracao-Geral.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBaixarContrato = () => {
    const link = document.createElement("a");
    link.href = "/contrato.docx";
    link.download = "Contrato-Prestacao-Servicos.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Gerar PDFs automaticamente quando a página carrega
  useEffect(() => {
    if (clienteData) {
      gerarPDFs();
    }
  }, [clienteData]);

  const generateDocsMutation = trpc.documents.generateDocuments.useMutation();

  const gerarPDFs = async () => {
    if (!clienteData) return;

    try {
      const resultado = await generateDocsMutation.mutateAsync({
        nomeCompleto: clienteData.nomeCompleto,
        nacionalidade: clienteData.nacionalidade || "",
        profissao: clienteData.profissao || "",
        estadoCivil: clienteData.estadoCivil || "",
        rg: clienteData.rg,
        cpf: clienteData.cpf,
        endereco: clienteData.endereco,
        numero: clienteData.numero || "",
        complemento: clienteData.complemento || "",
        bairro: clienteData.bairro,
        municipio: clienteData.municipio,
        estado: clienteData.estado,
      });

      if (resultado.sucesso) {
        console.log("PDFs gerados com sucesso:", resultado.documentos);
      }
    } catch (error) {
      console.error("Erro ao gerar PDFs:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Iniciar Processo Judicial
          </h1>
          <p className="text-gray-600">
            Passo 2 de 2: Documentos Necessários
          </p>
        </div>

        {/* Seção de Downloads */}
        <Card className="mb-8 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-lg">
              <strong>Documentos para Baixar e Assinar</strong>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Baixe os documentos abaixo, assine-os e anexe-os na seção "Documentos Necessários".
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-green-200">
                <div>
                  <p className="font-semibold text-gray-900">Procuração</p>
                  <p className="text-sm text-gray-600">Documento necessário para representação legal</p>
                </div>
                <Button
                  onClick={handleBaixarProcuracao}
                  className="bg-green-600 hover:bg-green-700 gap-2"
                >
                  <Download size={18} />
                  Baixar
                </Button>
              </div>

              <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-green-200">
                <div>
                  <p className="font-semibold text-gray-900">Contrato de Prestação de Serviços</p>
                  <p className="text-sm text-gray-600">Contrato com os termos dos serviços</p>
                </div>
                <Button
                  onClick={handleBaixarContrato}
                  className="bg-green-600 hover:bg-green-700 gap-2"
                >
                  <Download size={18} />
                  Baixar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção de Documentos Necessários */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">
              <strong>Documentos Necessários</strong>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-blue-800">
                Os documentos marcados com <strong>*</strong> são obrigatórios.
              </p>
            </div>

            <div className="space-y-4">
              {documentos.map((doc, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {doc.tipo}
                        {doc.obrigatorio && <span className="text-red-600"> *</span>}
                      </p>
                      {doc.arquivo && (
                        <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                          <Check size={16} />
                          {doc.arquivo.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <label className="flex-1 relative">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                        <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                        <p className="text-sm text-gray-600">
                          {doc.arquivo ? "Clique para alterar" : "Clique para anexar"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, DOC, DOCX, JPG, PNG (máx. 10MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleArquivoChange(index, file);
                        }}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </label>

                    {doc.arquivo && (
                      <button
                        onClick={() => handleArquivoChange(index, null)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumo */}
        <Card className="mb-8 bg-gray-50">
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Cliente:</span>
              <span className="font-semibold text-gray-900">{clienteData?.nomeCompleto}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">E-mail:</span>
              <span className="font-semibold text-gray-900">{clienteData?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Documentos Anexados:</span>
              <span className="font-semibold text-gray-900">
                {documentos.filter(d => d.arquivo).length}/{documentos.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Documentos Obrigatórios:</span>
              <span className={`font-semibold ${validarDocumentos() ? "text-green-600" : "text-red-600"}`}>
                {documentos.filter(d => d.obrigatorio && d.arquivo).length}/{documentos.filter(d => d.obrigatorio).length}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setLocation("/contratacao")}
          >
            Voltar
          </Button>
          <Button
            onClick={handleContinuar}
            disabled={!validarDocumentos()}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Contratar
          </Button>
        </div>
      </div>
    </div>
  );
}
