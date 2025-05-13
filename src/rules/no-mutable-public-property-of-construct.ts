import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";

import { isConstructOrStackType } from "../utils/typeCheck";

/**
 * Disallow mutable public properties of Construct
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 * @see {@link https://eslint-cdk-plugin.dev/rules/no-mutable-public-fields} - Documentation
 */
export const noMutablePublicPropertyOfConstruct =
  ESLintUtils.RuleCreator.withoutDocs({
    meta: {
      type: "problem",
      docs: {
        description: "Disallow mutable public properties of Construct",
      },
      fixable: "code",
      messages: {
        noMutablePublicPropertyOfConstruct:
          "Public property '{{ propertyName }}' should be readonly. Consider adding the 'readonly' modifier.",
      },
      schema: [],
    },
    defaultOptions: [],
    create(context) {
      const parserServices = ESLintUtils.getParserServices(context);

      return {
        ClassDeclaration(node) {
          const sourceCode = context.sourceCode;
          const type = parserServices.getTypeAtLocation(node);
          if (!isConstructOrStackType(type)) return;

          for (const member of node.body.body) {
            // NOTE: check property definition
            if (
              member.type !== AST_NODE_TYPES.PropertyDefinition ||
              member.key.type !== AST_NODE_TYPES.Identifier
            ) {
              continue;
            }

            // NOTE: Skip private and protected fields
            if (["private", "protected"].includes(member.accessibility ?? "")) {
              continue;
            }

            // NOTE: Skip if readonly is present
            if (member.readonly) continue;

            context.report({
              node: member,
              messageId: "noMutablePublicPropertyOfConstruct",
              data: {
                propertyName: member.key.name,
              },
              fix: (fixer) => {
                const accessibility = member.accessibility ? "public " : "";
                const paramText = sourceCode.getText(member);
                const [key, value] = paramText.split(":");
                const replacedKey = key.startsWith("public ")
                  ? key.replace("public ", "")
                  : key;

                return fixer.replaceText(
                  member,
                  `${accessibility}readonly ${replacedKey}:${value}`
                );
              },
            });
          }
        },
      };
    },
  });
