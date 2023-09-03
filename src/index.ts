import { server } from "./server/server";

const PORT = 8000;

server.listen(PORT, () => console.log(`servidor rodando na porta: ${PORT}`));
