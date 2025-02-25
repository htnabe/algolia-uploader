import { runMain, defineCommand } from "citty";
import { description, name, version } from "../package.json";

// Define command
const main = defineCommand({
  // package name, version, description
  meta: { name, version, description },
  // Definition about args
  args: {
    name: {
      type: "positional",
      description: "Your name",
      required: true,
    },
    friendly: {
      type: "boolean",
      description: "Use friendly greeting",
    },
  },
  run({ args }) {
    console.log(`${args.friendly ? "Hi" : "Greetings"} ${args.name}!`);
  },
});

// Execute the command
runMain(main);
