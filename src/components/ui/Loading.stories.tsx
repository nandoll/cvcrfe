// src/components/ui/Loading.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Loading } from "./Loading";

// Meta information for the component
const meta = {
  title: "UI/Loading",
  component: Loading,
  parameters: {
    layout: "centered",
  },
  // Add tags to the component
  tags: ["autodocs"],
  // Define default args for all stories
  args: {
    size: "medium",
    color: "primary",
  },
  // Define controls for the args
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "Sets the size of the loading spinner",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "medium" },
      },
    },
    color: {
      control: { type: "select" },
      options: ["primary", "white", "dark"],
      description: "Sets the color of the loading spinner",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "primary" },
      },
    },
    text: {
      control: "text",
      description: "Text to display below the spinner",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
  },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {};

// Different sizes
export const Small: Story = {
  args: {
    size: "small",
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
  },
};

export const Large: Story = {
  args: {
    size: "large",
  },
};

// Different colors
export const Primary: Story = {
  args: {
    color: "primary",
  },
};

export const White: Story = {
  args: {
    color: "white",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const Dark: Story = {
  args: {
    color: "dark",
  },
};

// With text
export const WithText: Story = {
  args: {
    text: "Loading...",
  },
};

export const LargeWithText: Story = {
  args: {
    size: "large",
    text: "Loading data, please wait...",
  },
};

// White on dark background
export const WhiteOnDark: Story = {
  args: {
    color: "white",
    text: "Processing your request...",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
