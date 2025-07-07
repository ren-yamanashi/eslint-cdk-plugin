import { defineConfig } from "vitepress";
import llmstxt from "vitepress-plugin-llms";
import defaultConfig from "./sharedConfig.mjs";

export default defineConfig({
  ...defaultConfig,
  base: "/",
  title: "eslint-cdk-plugin",
  description: "ESLint plugin for AWS CDK",
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        href: "/img/logo.png",
      },
    ],
    // setting OGP
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "eslint-cdk-plugin" }],
    [
      "meta",
      {
        property: "og:description",
        content: "ESLint plugin for AWS CDK",
      },
    ],
    [
      "meta",
      {
        property: "og:url",
        content: "https://eslint-cdk-plugin.dev/",
      },
    ],
    [
      "meta",
      {
        property: "og:image",
        content: "https://eslint-cdk-plugin.dev/img/ogp.png",
      },
    ],
    // Twitter Card
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: "eslint-cdk-plugin" }],
    [
      "meta",
      {
        name: "twitter:description",
        content: "ESLint plugin for AWS CDK",
      },
    ],
    [
      "meta",
      {
        name: "twitter:image",
        content: "https://eslint-cdk-plugin.dev/img/ogp.png",
      },
    ],
    // Other meta tags
    ["meta", { name: "author", content: "ren-yamanashi" }],
    [
      "meta",
      {
        name: "keywords",
        content: "eslint, aws-cdk, typescript, best-practices",
      },
    ],
  ],
  locales: {
    root: {
      label: "English",
      lang: "en",
      themeConfig: {
        ...defaultConfig.themeConfig,
        logo: "/img/logo.png",
        sidebar: [
          {
            text: "Introduction",
            collapsed: true,
            link: "/introduction/",
          },
          {
            text: "Getting Started",
            collapsed: true,
            link: "/getting-started/",
          },
          {
            text: "Rules",
            collapsed: false,
            link: "/rules/",
            items: [
              {
                text: "construct-constructor-property",
                link: "/rules/construct-constructor-property",
              },
              {
                text: "no-construct-in-interface",
                link: "/rules/no-construct-in-interface",
              },
              {
                text: "no-construct-in-public-property-of-construct",
                link: "/rules/no-construct-in-public-property-of-construct",
              },
              {
                text: "no-construct-stack-suffix",
                link: "/rules/no-construct-stack-suffix",
              },
              {
                text: "no-import-private",
                link: "/rules/no-import-private",
              },
              {
                text: "no-mutable-property-of-props-interface",
                link: "/rules/no-mutable-property-of-props-interface",
              },
              {
                text: "no-mutable-public-property-of-construct",
                link: "/rules/no-mutable-public-property-of-construct",
              },
              {
                text: "no-parent-name-construct-id-match",
                link: "/rules/no-parent-name-construct-id-match",
              },
              {
                text: "no-unused-props",
                link: "/rules/no-unused-props",
              },
              {
                text: "no-variable-construct-id",
                link: "/rules/no-variable-construct-id",
              },
              {
                text: "pascal-case-construct-id",
                link: "/rules/pascal-case-construct-id",
              },
              {
                text: "props-name-convention",
                link: "/rules/props-name-convention",
              },
              {
                text: "require-jsdoc",
                link: "/rules/require-jsdoc",
              },
              {
                text: "require-passing-this",
                link: "/rules/require-passing-this",
              },
              {
                text: "require-props-default-doc",
                link: "/rules/require-props-default-doc",
              },
            ],
          },
          {
            text: "Playground",
            collapsed: true,
            link: "/playground/",
          },
        ],
        socialLinks: [
          {
            icon: {
              svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>`,
            },
            link: "https://github.com/ren-yamanashi/eslint-cdk-plugin/tree/main",
          },
        ],
      },
    },
    ja: {
      label: "Japanese",
      lang: "ja",
      link: "/ja/",
      title: "eslint-cdk-plugin",
      themeConfig: {
        ...defaultConfig.themeConfig,
        logo: "/img/logo.png",
        sidebar: [
          {
            text: "Introduction",
            collapsed: true,
            link: "/ja/introduction/",
          },
          {
            text: "Getting Started",
            collapsed: true,
            link: "/ja/getting-started/",
          },
          {
            text: "Rules",
            collapsed: false,
            link: "/ja/rules/",
            items: [
              {
                text: "construct-constructor-property",
                link: "/ja/rules/construct-constructor-property",
              },
              {
                text: "no-construct-in-interface",
                link: "/ja/rules/no-construct-in-interface",
              },
              {
                text: "no-construct-in-public-property-of-construct",
                link: "/ja/rules/no-construct-in-public-property-of-construct",
              },
              {
                text: "no-construct-stack-suffix",
                link: "/ja/rules/no-construct-stack-suffix",
              },
              {
                text: "no-import-private",
                link: "/ja/rules/no-import-private",
              },
              {
                text: "no-mutable-property-of-props-interface",
                link: "/ja/rules/no-mutable-property-of-props-interface",
              },
              {
                text: "no-mutable-public-property-of-construct",
                link: "/ja/rules/no-mutable-public-property-of-construct",
              },
              {
                text: "no-parent-name-construct-id-match",
                link: "/ja/rules/no-parent-name-construct-id-match",
              },
              {
                text: "no-unused-props",
                link: "/ja/rules/no-unused-props",
              },
              {
                text: "no-variable-construct-id",
                link: "/ja/rules/no-variable-construct-id",
              },
              {
                text: "pascal-case-construct-id",
                link: "/ja/rules/pascal-case-construct-id",
              },
              {
                text: "props-name-convention",
                link: "/ja/rules/props-name-convention",
              },
              {
                text: "require-jsdoc",
                link: "/ja/rules/require-jsdoc",
              },
              {
                text: "require-passing-this",
                link: "/ja/rules/require-passing-this",
              },
              {
                text: "require-props-default-doc",
                link: "/ja/rules/require-props-default-doc",
              },
            ],
          },
          {
            text: "Playground",
            collapsed: true,
            link: "/ja/playground/",
          },
        ],
        socialLinks: [
          {
            icon: {
              svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>`,
            },
            link: "https://github.com/ren-yamanashi/eslint-cdk-plugin/tree/main",
          },
        ],
      },
    },
  },
  vite: {
    plugins: [
      llmstxt({
        ignoreFiles: ["index.md", "ja/index.md"],
      }),
    ],
  },
});
