import tsParser from "@typescript-eslint/parser";

import { name, version } from "../package.json";

import { constructConstructorProperty } from "./rules/construct-constructor-property";
import { noConstructInInterface } from "./rules/no-construct-in-interface";
import { noConstructInPublicPropertyOfConstruct } from "./rules/no-construct-in-public-property-of-construct";
import { noConstructStackSuffix } from "./rules/no-construct-stack-suffix";
import { noImportPrivate } from "./rules/no-import-private";
import { noMutablePropertyOfPropsInterface } from "./rules/no-mutable-property-of-props-interface";
import { noMutablePublicPropertyOfConstruct } from "./rules/no-mutable-public-property-of-construct";
import { noParentNameConstructIdMatch } from "./rules/no-parent-name-construct-id-match";
import { noUnusedProps } from "./rules/no-unused-props";
import { noVariableConstructId } from "./rules/no-variable-construct-id";
import { pascalCaseConstructId } from "./rules/pascal-case-construct-id";
import { propsNameConvention } from "./rules/props-name-convention";
import { requireJSDoc } from "./rules/require-jsdoc";
import { requirePassingThis } from "./rules/require-passing-this";
import { requirePropsDefaultDoc } from "./rules/require-props-default-doc";

const rules = {
  "construct-constructor-property": constructConstructorProperty,
  "no-construct-in-interface": noConstructInInterface,
  "no-construct-in-public-property-of-construct":
    noConstructInPublicPropertyOfConstruct,
  "no-construct-stack-suffix": noConstructStackSuffix,
  "no-import-private": noImportPrivate,
  "no-mutable-property-of-props-interface": noMutablePropertyOfPropsInterface,
  "no-mutable-public-property-of-construct": noMutablePublicPropertyOfConstruct,
  "no-parent-name-construct-id-match": noParentNameConstructIdMatch,
  "no-unused-props": noUnusedProps,
  "no-variable-construct-id": noVariableConstructId,
  "pascal-case-construct-id": pascalCaseConstructId,
  "props-name-convention": propsNameConvention,
  "require-jsdoc": requireJSDoc,
  "require-passing-this": requirePassingThis,
  "require-props-default-doc": requirePropsDefaultDoc,
};

const cdkPlugin = {
  meta: { name, version },
  rules,
};

const createFlatConfig = (rules: Record<string, unknown>) => {
  return {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      cdk: cdkPlugin,
    },
    rules,
  };
};

const recommended = createFlatConfig({
  "cdk/construct-constructor-property": "error",
  "cdk/no-construct-in-interface": "error",
  "cdk/no-construct-in-public-property-of-construct": "error",
  "cdk/no-construct-stack-suffix": "error",
  "cdk/no-mutable-property-of-props-interface": "warn",
  "cdk/no-mutable-public-property-of-construct": "warn",
  "cdk/no-parent-name-construct-id-match": [
    "error",
    { disallowContainingParentName: false },
  ],
  // TODO: Enable this rule at v4.0.0
  // "cdk/no-unused-props": "error",
  "cdk/no-variable-construct-id": "error",
  "cdk/pascal-case-construct-id": "error",
  "cdk/require-passing-this": ["error", { allowNonThisAndDisallowScope: true }],
});

const strict = createFlatConfig({
  "cdk/construct-constructor-property": "error",
  "cdk/no-construct-in-interface": "error",
  "cdk/no-construct-in-public-property-of-construct": "error",
  "cdk/no-construct-stack-suffix": "error",
  "cdk/no-import-private": "error",
  "cdk/no-mutable-property-of-props-interface": "error",
  "cdk/no-mutable-public-property-of-construct": "error",
  "cdk/no-parent-name-construct-id-match": [
    "error",
    { disallowContainingParentName: true },
  ],
  "cdk/no-unused-props": "error",
  "cdk/no-variable-construct-id": "error",
  "cdk/pascal-case-construct-id": "error",
  "cdk/props-name-convention": "error",
  "cdk/require-jsdoc": "error",
  "cdk/require-passing-this": "error",
  "cdk/require-props-default-doc": "error",
});

const configs = {
  recommended,
  strict,
};

export { configs, rules };

export interface EslintCdkPlugin {
  rules: typeof rules;
  configs: typeof configs;
}

const eslintCdkPlugin: EslintCdkPlugin = {
  rules,
  configs,
};

export default eslintCdkPlugin;
