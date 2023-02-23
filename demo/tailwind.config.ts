import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  corePlugins: {
    //Resolve tailwind vs naiveui style conflict https://www.naiveui.com/en-US/os-theme/docs/style-conflict
    preflight: false,
  },
};
