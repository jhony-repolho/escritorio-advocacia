import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download } from "lucide-react";

export default function Sucesso() {
  const [, setLocation] = useLocation();
  const [clienteData, setClienteData] = useState<any>(null);

  useEffect(() => {
    // Carregar dados do cliente do localStorage
    const dados = localStorage.getItem("clienteData");
    if (dados) {
      setClienteData(JSON.parse(dados));
    }
  }, []);

  const handleDownloadDocumentos = () => {
    // TODO: Implementar download dos documentos
    alert("Download dos documentos iniciado");
  };

  const handleVoltar = () => {
    // Limpar dados do localStorage
    localStorage.removeItem("clienteData");
    localStorage.removeItem("contratacaoDados");
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho com Ícone de Sucesso */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-6">
              <CheckCircle className="text-green-600" size={64} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Seu processo judicial foi iniciado com sucesso
          </h1>
        </div>

        {/* Card de Confirmação */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">
              Próximos Passos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-600 text-white font-bold">
                  1
                </div>
              </div>
              <div>
                <p className="font-semibold">Contato da Nossa Equipe</p>
                <p className="text-sm">
                  Nossa equipe entrará em contato com você em 48 (Quarenta e Oito) horas através do telefone (91) 98319-0800.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-600 text-white font-bold">
                  2
                </div>
              </div>
              <div>
                <p className="font-semibold">Protocolo do Processo</p>
                <p className="text-sm">
                  Seu processo será protocolado no prazo máximo de 7 (sete) dias úteis a partir de hoje.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-600 text-white font-bold">
                  3
                </div>
              </div>
              <div>
                <p className="font-semibold">Acompanhamento</p>
                <p className="text-sm">
                  Você receberá atualizações por e-mail sobre o andamento do seu processo.
                </p>
              </div>
            </div>


          </CardContent>
        </Card>

        {/* Vídeo Explicativo */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Vídeo Explicativo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-gray-600 font-semibold mb-2">
                  Vídeo em breve
                </p>
                <p className="text-gray-500 text-sm">
                  O vídeo explicativo será adicionado em breve
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Este vídeo contém informações importantes sobre o andamento do seu processo e próximos passos.
            </p>
          </CardContent>
        </Card>

        {/* Informações de Contato */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">
              Dúvidas ou Suporte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700">
            <p>
              Se você tiver dúvidas sobre seu processo, entre em contato conosco:
            </p>
            <div className="space-y-2">
              <p>
                <strong>Telefone:</strong> (91) 98319-0800
              </p>
              <p>
                <strong>E-mail:</strong> contato@silvarepolho.com.br
              </p>
              <p>
                <strong>Endereço:</strong> Rua Dois de Junho, nº 7, Centro, Ananindeua-PA, CEP 67030-005
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Resumo da Contratação */}
        <Card className="mb-8 bg-gray-50">
          <CardHeader>
            <CardTitle>Resumo da Contratação</CardTitle>
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
              <span className="text-gray-700">Telefone:</span>
              <span className="font-semibold text-gray-900">{clienteData?.telefone}</span>
            </div>
            <div className="border-t border-gray-300 pt-3 mt-3 flex justify-between items-center">
              <span className="text-gray-700 font-semibold">Valor de Entrada:</span>
              <span className="font-bold text-green-600 text-lg">R$ 1.200,00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-semibold">Percentual sobre Ressarcimento:</span>
              <span className="font-bold text-green-600 text-lg">30%</span>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleDownloadDocumentos}
          >
            <Download size={18} />
            Baixar Comprovante
          </Button>
          <Button
            onClick={handleVoltar}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Voltar ao Início
          </Button>
        </div>

        {/* Rodapé */}
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>
            Obrigado por confiar em nossos serviços. Estamos comprometidos em obter o melhor resultado para você.
          </p>
        </div>
      </div>
    </div>
  );
}
