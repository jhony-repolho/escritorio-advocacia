import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Scale, Home as HomeIcon, Users } from "lucide-react";

export default function Areas() {
  const areas = [
    {
      icon: Scale,
      title: "Direito Previdenciário",
      description: "Aposentadorias, pensões, auxílios e revisões de benefícios do INSS. Atuação completa em todas as fases do processo previdenciário.",
      details: [
        "Aposentadoria por Tempo de Contribuição",
        "Aposentadoria por Idade",
        "Pensão por Morte",
        "Auxílio Doença",
        "Auxílio-Acidente",
        "Revisão de Benefícios",
        "Ação Judicial Previdenciária"
      ]
    },
    {
      icon: HomeIcon,
      title: "Direito Imobiliário",
      description: "Usucapião, legalização de imóveis, revisão de financiamentos e assessoria completa em questões imobiliárias.",
      details: [
        "Usucapião",
        "Legalização de imóveis",
        "Revisão de financiamento de imóveis",
        "Assessoria em lei lão de imóveis com retirada do possuidor",
        "Reintegração, manutenção e imissão ne posse",
        "Averbação de Construção / Desmembramento / Unificação",
        "Anulação de lei lão judicial e consolidação da propriedade"
      ]
    },
    {
      icon: Users,
      title: "Direito de Família e Sucessões",
      description: "Inventários, testamentos, planejamento sucessório, divórcio e questões de família. Assessoria completa em herança e família.",
      details: [
        "Inventário e Partilha",
        "Testamento",
        "Planejamento Sucessório",
        "Doação",
        "Pensão alimentícia",
        "Divórcio",
        "Partilha de bens"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-4 md:pt-28 md:pb-6 bg-gradient-to-b from-secondary to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
              Áreas de Atuação
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
              Expertise em Direito Previdenciário, Imobiliário e Família e Sucessões
            </p>
          </div>
        </div>
      </section>

      {/* Áreas */}
      <section className="py-2 md:py-3">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {areas.map((area, index) => {
              const Icon = area.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <Icon className="w-12 h-12 text-primary" />
                      <CardTitle>{area.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">{area.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {area.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="text-primary">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="bg-muted p-8 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Não encontrou o que procura?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Oferecemos consultoria em outras áreas do direito. Entre em contato para discutir seu caso específico.
            </p>
            <Link href="/contato">
              <Button size="lg">
                Solicitar Consulta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
