// .storybook/preview.ts
import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    nextjs: {
      appDirectory: true,
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#1a1a1a",
        },
      ],
    },
    // Automatically detect a11y issues
    a11y: {
      config: {
        rules: [
          {
            // You can disable rules if they don't apply
            id: "color-contrast",
            enabled: true,
          },
        ],
      },
    },
  },
  decorators: [
    // Adds theme switching capability in Storybook UI
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
    // Add Tailwind base classes to all stories
    (Story) => (
      <div className="font-sans antialiased text-gray-900">
        <Story />
      </div>
    ),
  ],
};

export default preview;
