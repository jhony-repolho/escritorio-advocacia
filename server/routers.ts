import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { calcularPrice, calcularMQJS } from "./calculadora";
import { clientsRouter } from "./routers/clients";
import { documentsRouter } from "./routers/documents";
import { notificationsRouter } from "./routers/notifications";

export const appRouter = router({
  system: systemRouter,
  clients: clientsRouter,
  documents: documentsRouter,
  notifications: notificationsRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  calculadora: router({
    calcular: publicProcedure
      .input(z.object({
        valorImovel: z.number().positive(),
        entrada: z.number().min(0),
        taxaJuros: z.number().positive(),
        ehTaxaAnual: z.boolean(),
        quantidadeParcelas: z.number().int().positive(),
        dataContrato: z.string(),
        dataPrimeiraParcela: z.string(),
        indiceCorrecao: z.enum(["INCC", "IPCA"]).optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const parcelas = await calcularPrice(
            input.valorImovel,
            input.entrada,
            input.taxaJuros,
            input.quantidadeParcelas,
            input.dataContrato,
            input.dataPrimeiraParcela,
            input.ehTaxaAnual,
            input.indiceCorrecao
          );
          
          return { parcelas };
        } catch (error) {
          console.error("Erro ao calcular PRICE:", error);
          throw error;
        }
      }),

    calcularMQJS: publicProcedure
      .input(z.object({
        valorImovel: z.number().positive(),
        entrada: z.number().min(0),
        taxaJuros: z.number().positive(),
        ehTaxaAnual: z.boolean(),
        quantidadeParcelas: z.number().int().positive(),
        dataContrato: z.string(),
        dataPrimeiraParcela: z.string(),
        indiceCorrecao: z.enum(["INCC", "IPCA"]).optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const parcelas = await calcularMQJS(
            input.valorImovel,
            input.entrada,
            input.taxaJuros,
            input.quantidadeParcelas,
            input.dataContrato,
            input.dataPrimeiraParcela,
            input.ehTaxaAnual,
            input.indiceCorrecao
          );
          
          return { parcelas };
        } catch (error) {
          console.error("Erro ao calcular MQJS:", error);
          throw error;
        }
      }),

    calcularDiferencaCorrigida: publicProcedure
      .input(z.object({
        diferenca: z.number(),
        dataVencimento: z.string(),
        indiceCorrecao: z.enum(["INCC", "IPCA"]),
      }))
      .mutation(async ({ input }) => {
        const { diferenca, dataVencimento, indiceCorrecao } = input;

        // Índice de correção não está sendo usado nesta versão simplificada
        let diferencaCorrigida = diferenca;
        let fatorCorrecao = 1;

        return {
          diferencaCorrigida,
          fatorCorrecao,
          percentualCorrecao: 0,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
