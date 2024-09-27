import { EstreexTypeError } from "../error.mjs";
import { getDoubleton, getRecord, getTripleton } from "../access.mjs";
import {
  subguardPrivateKeyIdentifier,
  subguardPublicKeyIdentifier,
} from "./identifier.mjs";
import { subguardPublicKeyLiteral } from "./literal.mjs";
import {
  KEY_IDENTIFIER_TYPE_RECORD,
  KEY_TYPE_RECORD,
  PUBLIC_KEY_TYPE_RECORD,
} from "../index.mjs";

/**
 * @type {import("../guard").Guard<
 *   import("../syntax/key").Key<{}>
 * >}
 */
export const guardKey = (node, path, annotate) => {
  const kind = "Key";
  const type = getRecord(node, "type", kind, path, KEY_TYPE_RECORD);
  switch (type) {
    case "Identifier": {
      return subguardPublicKeyIdentifier(node, path, annotate, type, kind);
    }
    case "PrivateIdentifier": {
      return subguardPrivateKeyIdentifier(node, path, annotate, type, kind);
    }
    case "Literal": {
      return subguardPublicKeyLiteral(node, path, annotate, type, kind);
    }
    default: {
      throw new EstreexTypeError(type);
    }
  }
};

/**
 * @type {import("../guard").Guard<
 *   import("../syntax/key").PublicKey<{}>
 * >}
 */
export const guardPublicKey = (node, path, annotate) => {
  const kind = "Key";
  const type = getRecord(node, "type", kind, path, PUBLIC_KEY_TYPE_RECORD);
  switch (type) {
    case "Identifier": {
      return subguardPublicKeyIdentifier(node, path, annotate, type, kind);
    }
    case "Literal": {
      return subguardPublicKeyLiteral(node, path, annotate, type, kind);
    }
    default: {
      throw new EstreexTypeError(type);
    }
  }
};

/**
 * @type {import("../guard").Guard<
 *   import("../").PublicKeyIdentifier<{}>
 * >}
 */
export const guardPublicKeyIdentifier = (node, path, annotate) => {
  const kind = "PublicKeyIdentifier";
  return subguardPublicKeyIdentifier(node, path, annotate, "Identifier", kind);
};

/**
 * @type {import("../guard").Guard<
 *   import("../").KeyIdentifier<{}>
 * >}
 */
export const guardIdentifierKey = (node, path, annotate) => {
  const kind = "IdentifierKey";
  const type = getRecord(node, "type", kind, path, KEY_IDENTIFIER_TYPE_RECORD);
  switch (type) {
    case "Identifier": {
      return subguardPublicKeyIdentifier(node, path, annotate, type, kind);
    }
    case "PrivateIdentifier": {
      return subguardPrivateKeyIdentifier(node, path, annotate, type, kind);
    }
    default: {
      throw new EstreexTypeError(type);
    }
  }
};
