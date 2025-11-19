import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Inicio from "./pages/Inicio";
import Sobre from "./pages/Sobre";
import Areas from "./pages/Areas";
import Artigos from "./pages/Artigos";
import Contato from "./pages/Contato";
import ContratacaoDocumentos from "./pages/ContratacaoDocumentos";
import Sucesso from "./pages/Sucesso";


function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Inicio} />
      <Route path={"/inicio"} component={Inicio} />
      <Route path={"/sobre"} component={Sobre} />
      <Route path={"/areas"} component={Areas} />
      <Route path={"/artigos"} component={Artigos} />
      <Route path={"/contato"} component={Contato} />
      <Route path={"/contratacao-documentos"} component={ContratacaoDocumentos} />
      {/* Rota de pagamento desabilitada por tempo indeterminado */}
      {/* <Route path={"/pagamento"} component={Pagamento} /> */}
      <Route path={"/sucesso"} component={Sucesso} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
