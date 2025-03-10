// Generated by Xata Codegen 0.30.1. Please do not edit.
import { buildClient } from "@xata.io/client";
/** @typedef { import('./types').SchemaTables } SchemaTables */
/** @type { SchemaTables } */
const tables = [
  {
    name: "user",
    columns: [
      { name: "name", type: "string" },
      { name: "email", type: "string" },
      { name: "password", type: "string" },
    ],
  },
  {
    name: "instaladores-ac-pf",
    columns: [
      { name: "nome_completo", type: "text" },
      { name: "email", type: "text" },
      { name: "whatsapp", type: "text" },
      { name: "cpf", type: "text" },
      { name: "estado", type: "text" },
    ],
  },
  {
    name: "instaladores-ac-pj",
    columns: [
      { name: "nome_empresarial", type: "text" },
      { name: "email", type: "text" },
      { name: "whatsapp", type: "text" },
      { name: "cnpj", type: "text" },
      { name: "estado", type: "text" },
    ],
  },
];
/** @type { import('@xata.io/client').ClientConstructor<{}> } */
const DatabaseClient = buildClient();
const defaultOptions = {
  databaseURL: "https://app-6anock.us-east-1.xata.sh/db/database-cloud",
};
/** @typedef { import('./types').DatabaseSchema } DatabaseSchema */
/** @extends DatabaseClient<DatabaseSchema> */
export class XataClient extends DatabaseClient {
  constructor(options) {
    super({ ...defaultOptions, ...options }, tables);
  }
}
let instance = undefined;
/** @type { () => XataClient } */
export const getXataClient = () => {
  if (instance) return instance;
  instance = new XataClient();
  return instance;
};
