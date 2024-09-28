import { AnonymousClassDeclaration, ClassDeclaration } from "./class";
import { Expression } from "./expression";
import { AnonymousFunctionDeclaration, FunctionDeclaration } from "./function";
import { Pattern } from "./pattern";

export type VariableKind = "var" | "let" | "const";

export type Declaration<X> =
  | VariableDeclaration<X>
  | FunctionDeclaration<X>
  | ClassDeclaration<X>;

export type VariableDeclaration<X> = (X extends null ? {} : X) & {
  type: "VariableDeclaration";
  declarations: VariableDeclarator<X>[];
  kind: VariableKind;
};

export type VariableDeclarator<X> = (X extends null ? {} : X) & {
  type: "VariableDeclarator";
  id: Pattern<X>;
  init: Expression<X> | null;
};
