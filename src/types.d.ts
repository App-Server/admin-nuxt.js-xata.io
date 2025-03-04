import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";
declare const tables: readonly [
  {
    readonly name: "user";
    readonly columns: readonly [
      {
        readonly name: "name";
        readonly type: "string";
      },
      {
        readonly name: "email";
        readonly type: "string";
      },
      {
        readonly name: "password";
        readonly type: "string";
      }
    ];
  },
  {
    readonly name: "instaladores-ac-pf";
    readonly columns: readonly [
      {
        readonly name: "nome_completo";
        readonly type: "text";
      },
      {
        readonly name: "email";
        readonly type: "text";
      },
      {
        readonly name: "whatsapp";
        readonly type: "text";
      },
      {
        readonly name: "cpf";
        readonly type: "text";
      },
      {
        readonly name: "estado";
        readonly type: "text";
      }
    ];
  },
  {
    readonly name: "instaladores-ac-pj";
    readonly columns: readonly [
      {
        readonly name: "nome_empresarial";
        readonly type: "text";
      },
      {
        readonly name: "email";
        readonly type: "text";
      },
      {
        readonly name: "whatsapp";
        readonly type: "text";
      },
      {
        readonly name: "cnpj";
        readonly type: "text";
      },
      {
        readonly name: "estado";
        readonly type: "text";
      }
    ];
  }
];
export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;
export type User = InferredTypes["user"];
export type UserRecord = User & XataRecord;
export type InstaladoresAcPf = InferredTypes["instaladores-ac-pf"];
export type InstaladoresAcPfRecord = InstaladoresAcPf & XataRecord;
export type InstaladoresAcPj = InferredTypes["instaladores-ac-pj"];
export type InstaladoresAcPjRecord = InstaladoresAcPj & XataRecord;
export type DatabaseSchema = {
  user: UserRecord;
  "instaladores-ac-pf": InstaladoresAcPfRecord;
  "instaladores-ac-pj": InstaladoresAcPjRecord;
};
declare const DatabaseClient: any;
export declare class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions);
}
export declare const getXataClient: () => XataClient;
export {};
