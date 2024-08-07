import { Environment } from "vitest";

const environment: Environment = {
  name: 'prisma',
  async setup() {
    console.log("setup");
    // Código adicional de configuração pode ser necessário aqui.
    return {
      async teardown() {
        console.log("teardown");
        // Código adicional para desmontar o ambiente pode ser necessário aqui.
      },
    };
  },
  transformMode: "web"
};

export default environment;
