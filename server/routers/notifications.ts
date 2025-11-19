import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const notificationsRouter = router({
  enviarNotificacaoContato: publicProcedure
    .input(z.object({
      nome: z.string(),
      email: z.string().email(),
      telefone: z.string().optional(),
      assunto: z.string(),
      mensagem: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Placeholder for notification service
      console.log("Contato recebido:", input);
      return { success: true, message: "Notificacao recebida" };
    }),

  enviarNotificacaoCalculadora: publicProcedure
    .input(z.object({
      nome: z.string(),
      email: z.string().email(),
      telefone: z.string().optional(),
      valorImovel: z.number(),
      entrada: z.number(),
      taxaJuros: z.number(),
      quantidadeParcelas: z.number(),
      dataContrato: z.string(),
      dataPrimeiraParcela: z.string(),
      indiceCorrecao: z.string().optional(),
      resultadoRevisao: z.number(),
      primeiraParcelaRevisada: z.number(),
    }))
    .mutation(async ({ input }) => {
      // Placeholder for notification service
      console.log("Calculo recebido:", input);
      return { success: true, message: "Calculo recebido" };
    }),
});
