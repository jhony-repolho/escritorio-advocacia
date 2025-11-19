import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Sobre() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-4 md:pt-28 md:pb-6 bg-gradient-to-b from-secondary to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
              Sobre Nós
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
              Conheça nossa história, valores e compromisso com a excelência jurídica
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="py-2 md:py-3">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Quem Somos</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Silva & Repolho: Advogados Associados oferece assessoria jurídica personalizada
                nas áreas de Direito Previdenciário, Imobiliário e Família e Sucessões. Com anos de experiência
                e compromisso com a excelência, nossa missão é garantir que seus direitos sejam plenamente
                respeitados e defendidos com estratégias jurídicas eficazes e atualizadas.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Acreditamos em um atendimento humanizado, onde cada cliente recebe atenção
                individualizada e soluções adaptadas às suas necessidades específicas.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Nossa Missão</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Defender os direitos de nossos clientes com excelência, ética e dedicação,
                oferecendo soluções jurídicas inovadoras e acessíveis que transformem vidas
                e protejam patrimônios.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Nossos Valores</h2>
              <ul className="space-y-4 text-lg text-muted-foreground">
                <li className="flex items-start gap-4">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Excelência:</strong> Buscamos sempre a melhor solução jurídica</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Ética:</strong> Agimos com integridade e transparência</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Humanidade:</strong> Entendemos os desafios de nossos clientes</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Inovação:</strong> Utilizamos tecnologia para melhorar nossos serviços</span>
                </li>
              </ul>
            </div>

            <div className="bg-muted p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-6">Pronto para Começar?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Entre em contato conosco para uma consulta personalizada e descubra como podemos ajudá-lo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contato">
                  <Button size="lg">
                    Agendar Consulta
                  </Button>
                </Link>
                <Link href="/areas">
                  <Button size="lg" variant="outline">
                    Ver Áreas de Atuação
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
