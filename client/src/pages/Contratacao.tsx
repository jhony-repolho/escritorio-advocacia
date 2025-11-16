import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

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

export default function Contratacao() {
  const [, setLocation] = useLocation();
  const [clienteData, setClienteData] = useState<ClienteData>({
    nomeCompleto: "",
    nacionalidade: "",
    profissao: "",
    estadoCivil: "",
    rg: "",
    cpf: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    municipio: "",
    estado: "",
    telefone: "",
    email: "",
  });

  const [erros, setErros] = useState<Record<string, string>>({});

  const handleClienteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClienteData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Limpar erro do campo
    if (erros[name]) {
      setErros(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};

    if (!clienteData.nomeCompleto.trim()) novosErros.nomeCompleto = "Nome completo é obrigatório";
    if (!clienteData.rg.trim()) novosErros.rg = "RG é obrigatório";
    if (!clienteData.cpf.trim()) novosErros.cpf = "CPF é obrigatório";
    if (!clienteData.endereco.trim()) novosErros.endereco = "Endereço é obrigatório";
    if (!clienteData.bairro.trim()) novosErros.bairro = "Bairro é obrigatório";
    if (!clienteData.municipio.trim()) novosErros.municipio = "Município é obrigatório";
    if (!clienteData.estado.trim()) novosErros.estado = "Estado é obrigatório";
    if (!clienteData.telefone.trim()) novosErros.telefone = "Telefone é obrigatório";
    if (!clienteData.email.trim()) novosErros.email = "E-mail é obrigatório";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleProxima = () => {
    if (validarFormulario()) {
      // Salvar dados em localStorage para próxima página
      localStorage.setItem("clienteData", JSON.stringify(clienteData));
      setLocation("/contratacao-documentos");
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
            Passo 1 de 2: Informações Pessoais
          </p>
        </div>

        {/* Informações sobre Serviços */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">
              <strong>Informações sobre os Serviços Prestados</strong>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700">
            <p>
              Nosso escritório ficará responsável por todo o seu processo judicial de revisão contratual, devendo protocolar o processo no prazo máximo e improrrogável de 7 (sete) dias úteis a partir da confirmação do pagamento.
            </p>
          </CardContent>
        </Card>

        {/* Informações sobre Pagamentos */}
        <Card className="mb-8 bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-lg">
              <strong>Informações sobre Pagamentos</strong>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700">
            <p>
              Nosso escritório cobra como honorários advocatícios o valor <strong>R$ 1.200,00 (Um Mil e Duzentos Reais)</strong> de entrada para dar inicio ao processo mais <strong>30% (Trinta Por Cento)</strong> sobre o valor que você vier a receber ao final do processo.
            </p>
            <div className="bg-white p-4 rounded border border-orange-200 space-y-2 text-sm">
              <p>
                <strong>OBS:</strong> O pagamento da entrada poderá ser realizado por:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>PIX</strong> com desconto de R$ 200,00 (Duzentos Reais)</li>
                <li><strong>Cartão de Crédito</strong> (podendo ser parcelado em 12x sem juros)</li>
                <li><strong>2x Boleto Bancário</strong> (vencendo o primeiro no dia da contratação e o segundo após 30 dias)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Formulário de Dados Pessoais */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                name="nomeCompleto"
                value={clienteData.nomeCompleto}
                onChange={handleClienteChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  erros.nomeCompleto ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Digite seu nome completo"
              />
              {erros.nomeCompleto && (
                <p className="text-red-600 text-sm mt-1">{erros.nomeCompleto}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nacionalidade
              </label>
              <input
                type="text"
                name="nacionalidade"
                value={clienteData.nacionalidade}
                onChange={handleClienteChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  erros.nacionalidade ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: Brasileira"
              />
              {erros.nacionalidade && (
                <p className="text-red-600 text-sm mt-1">{erros.nacionalidade}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profissão
                </label>
                <input
                  type="text"
                  name="profissao"
                  value={clienteData.profissao}
                  onChange={handleClienteChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    erros.profissao ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ex: Empresário"
                />
                {erros.profissao && (
                  <p className="text-red-600 text-sm mt-1">{erros.profissao}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado Civil
                </label>
                <select
                  name="estadoCivil"
                  value={clienteData.estadoCivil}
                  onChange={handleClienteChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    erros.estadoCivil ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="Solteiro(a)">Solteiro(a)</option>
                  <option value="Casado(a)">Casado(a)</option>
                  <option value="Divorciado(a)">Divorciado(a)</option>
                  <option value="Viúvo(a)">Viúvo(a)</option>
                  <option value="União Estável">União Estável</option>
                </select>
                {erros.estadoCivil && (
                  <p className="text-red-600 text-sm mt-1">{erros.estadoCivil}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RG *
                </label>
                <input
                  type="text"
                  name="rg"
                  value={clienteData.rg}
                  onChange={handleClienteChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    erros.rg ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="00.000.000-0"
                />
                {erros.rg && (
                  <p className="text-red-600 text-sm mt-1">{erros.rg}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={clienteData.cpf}
                  onChange={handleClienteChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    erros.cpf ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="000.000.000-00"
                />
                {erros.cpf && (
                  <p className="text-red-600 text-sm mt-1">{erros.cpf}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço *
              </label>
              <input
                type="text"
                name="endereco"
                value={clienteData.endereco}
                onChange={handleClienteChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  erros.endereco ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Rua"
              />
              {erros.endereco && (
                <p className="text-red-600 text-sm mt-1">{erros.endereco}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nº
                </label>
                <input
                  type="text"
                  name="numero"
                  value={clienteData.numero}
                  onChange={handleClienteChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    erros.numero ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Número"
                />
                {erros.numero && (
                  <p className="text-red-600 text-sm mt-1">{erros.numero}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complemento
                </label>
                <input
                  type="text"
                  name="complemento"
                  value={clienteData.complemento}
                  onChange={handleClienteChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    erros.complemento ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Apto, sala, etc"
                />
                {erros.complemento && (
                  <p className="text-red-600 text-sm mt-1">{erros.complemento}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bairro *
                </label>
                <input
                  type="text"
                  name="bairro"
                  value={clienteData.bairro}
                  onChange={handleClienteChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    erros.bairro ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Bairro"
                />
                {erros.bairro && (
                  <p className="text-red-600 text-sm mt-1">{erros.bairro}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Município *
                </label>
                <input
                  type="text"
                  name="municipio"
                  value={clienteData.municipio}
                  onChange={handleClienteChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    erros.municipio ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Município"
                />
                {erros.municipio && (
                  <p className="text-red-600 text-sm mt-1">{erros.municipio}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado *
                </label>
                <select
                  name="estado"
                  value={clienteData.estado}
                  onChange={handleClienteChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    erros.estado ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </select>
                {erros.estado && (
                  <p className="text-red-600 text-sm mt-1">{erros.estado}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={clienteData.telefone}
                  onChange={handleClienteChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    erros.telefone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="(00) 00000-0000"
                />
                {erros.telefone && (
                  <p className="text-red-600 text-sm mt-1">{erros.telefone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  name="email"
                  value={clienteData.email}
                  onChange={handleClienteChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    erros.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="seu.email@example.com"
                />
                {erros.email && (
                  <p className="text-red-600 text-sm mt-1">{erros.email}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => window.history.back()}
          >
            Voltar
          </Button>
          <Button
            onClick={handleProxima}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Próxima Etapa
          </Button>
        </div>
      </div>
    </div>
  );
}
