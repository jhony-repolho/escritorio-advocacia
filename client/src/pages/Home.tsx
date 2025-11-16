import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CalculadoraRevisional from "@/components/CalculadoraRevisional";
import ContatoSection from "@/components/ContatoSection";
import { Scale, Home as HomeIcon, Users, FileText, Calculator } from "lucide-react";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const areas = [
    {
      icon: Scale,
      title: "Direito Previdenciário",
      description: "Aposentadorias, pensões, auxílios e revisões de benefícios do INSS. Atuação completa em todas as fases do processo previdenciário."
    },
    {
      icon: HomeIcon,
      title: "Direito Imobiliário",
      description: "Compra e venda, contratos de locação, usucapião, regularização de imóveis e questões condominiais."
    },
    {
      icon: Users,
      title: "Direito das Sucessões",
      description: "Inventários, testamentos, planejamento sucessório e partilha de bens. Assessoria completa em questões de herança."
    }
  ];

  const articles = [
    {
      title: "Aposentadoria por Tempo de Contribuição: O que mudou?",
      excerpt: "Entenda as principais alterações nas regras de aposentadoria após a reforma da previdência e como isso afeta seus direitos.",
      date: "15 de Outubro, 2024",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      title: "Usucapião: Como regularizar seu imóvel",
      excerpt: "Conheça os requisitos e o processo para adquirir a propriedade de um imóvel através da usucapião.",
      date: "10 de Outubro, 2024",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      title: "Planejamento Sucessório: Proteja seu patrimônio",
      excerpt: "Saiba como organizar a sucessão de bens de forma eficiente e evitar conflitos familiares no futuro.",
      date: "5 de Outubro, 2024",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-secondary to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
              Silva e Repolho: Advogados Associados
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              Atuação focada em Direito Previdenciário, Imobiliário e Sucessões.
              Defendemos seus interesses com experiência e dedicação.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#contato">
                <Button size="lg" className="text-base px-8">
                  Agendar Consulta
                </Button>
              </Link>
              <Link href="#calculadora">
                <Button size="lg" variant="outline" className="text-base px-8">
                  Solicitar Revisão
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-center">Sobre Nós</h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-center mb-8">
              Silva e Repolho: Advogados Associados oferece assessoria jurídica personalizada
              nas áreas de Direito Previdenciário, Imobiliário e Sucessões. Com anos de experiência
              e compromisso com a excelência, nossa missão é garantir que seus direitos sejam plenamente
              respeitados e defendidos com estratégias jurídicas eficazes e atualizadas.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed text-center">
              Acreditamos em um atendimento humanizado, onde cada cliente recebe atenção
              individualizada e soluções adaptadas às suas necessidades específicas.
            </p>
          </div>
        </div>
      </section>

      {/* Áreas de Atuação */}
      <section id="areas" className="py-20 bg-secondary">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center">Áreas de Atuação</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {areas.map((area, index) => (
              <Card key={index} className="border-border hover:shadow-xl hover:border-accent/50 transition-all duration-300">
                <CardHeader>
                  <div className="w-14 h-14 rounded-lg bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
                    <area.icon className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-xl">{area.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {area.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Artigos com Vídeos */}
      <section id="artigos" className="py-20">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold">Artigos Jurídicos</h2>
            <Button variant="outline">Ver Todos</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow overflow-hidden">
                <div className="aspect-video bg-muted">
                  <iframe
                    width="100%"
                    height="100%"
                    src={article.video}
                    title={article.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <FileText className="h-4 w-4" />
                    <span>{article.date}</span>
                  </div>
                  <CardTitle className="text-xl leading-tight">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed mb-4">
                    {article.excerpt}
                  </CardDescription>
                  <Button variant="link" className="p-0 h-auto">
                    Ler mais →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calculadora Revisional */}
      <section id="calculadora" className="py-20 bg-secondary">
        <div className="container">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="h-8 w-8 text-primary" />
              <h2 className="text-4xl font-bold">Calculadora Revisional</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Analise seu contrato imobiliário e verifique se você tem direito a revisão.
              Preencha os dados abaixo para uma análise preliminar.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <CalculadoraRevisional />
          </div>
        </div>
      </section>

      <ContatoSection />

      <Footer />
    </div>
  );
}
