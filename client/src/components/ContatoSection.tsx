import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, MessageCircle, Mail } from "lucide-react";
import ContactForm from "./ContactForm";

export default function ContatoSection() {
  const endereco = {
    rua: "Rua Dois de Junho, nº 7",
    bairro: "Centro",
    cidade: "Ananindeua",
    estado: "Pará",
    cep: "67030-005",
    telefone: "(91) 98319-0800",
    whatsapp: "(91) 98319-0800",
    email: "contato@silvarepolho.com.br",
    latitude: -1.3817,
    longitude: -48.2931,
  };

  const abrirWhatsApp = () => {
    const mensagem = "Olá! Gostaria de agendar uma consulta com a Silva e Repolho Advogados.";
    const url = `https://wa.me/55${endereco.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  const abrirMapa = () => {
    const url = `https://www.google.com/maps/search/${endereco.rua}+${endereco.cidade}+${endereco.estado}`;
    window.open(url, "_blank");
  };

  return (
    <section id="contato" className="py-0">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Informações de Contato */}
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Endereço */}
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Endereço</h3>
                      <p className="text-sm text-muted-foreground">
                        {endereco.rua}<br />
                        {endereco.bairro}, {endereco.cidade}<br />
                        {endereco.estado}, {endereco.cep}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={abrirMapa}
                  >
                    Ver no Mapa
                  </Button>
                </div>

                {/* Telefone */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">Telefone</h3>
                      <p className="text-sm text-muted-foreground">{endereco.telefone}</p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <MessageCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">WhatsApp</h3>
                      <p className="text-sm text-muted-foreground">{endereco.whatsapp}</p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={abrirWhatsApp}
                  >
                    Enviar Mensagem
                  </Button>
                </div>

                {/* E-mail */}
                <div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">E-mail</h3>
                      <a
                        href={`mailto:${endereco.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {endereco.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mapa */}
          <div className="lg:col-span-2">
            <Card className="border-border overflow-hidden h-full">
              <iframe
                width="100%"
                height="100%"
                style={{ minHeight: "400px" }}
                frameBorder={0}
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8167477850876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a2c5a5a5a5a5a5%3A0x0!2s${encodeURIComponent(endereco.rua + ", " + endereco.cidade + ", " + endereco.estado)}!5e0!3m2!1spt-BR!2sbr!4v1234567890`}
                allowFullScreen
                loading="lazy"
              />
            </Card>
          </div>
        </div>

        {/* Formulário de Contato */}
        <div className="max-w-2xl mx-auto">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
