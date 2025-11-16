import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sobre */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Silva e Repolho</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Advogados Associados especializados em Direito Previdenciário, Imobiliário e Sucessões.
              Atendimento personalizado e comprometido com seus direitos.
            </p>
          </div>

          {/* Áreas de Atuação */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Áreas de Atuação</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Direito Previdenciário</li>
              <li>Direito Imobiliário</li>
              <li>Direito das Sucessões</li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(91) 98319-0800</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contato@silvarepolho.com.br</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Rua Dois de Junho, nº 7, Centro, Ananindeua-PA, CEP 67030-005</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Silva e Repolho: Advogados Associados. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
