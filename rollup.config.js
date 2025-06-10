import { spawn } from "child_process";
import svelte from "rollup-plugin-svelte";
import { sveltePreprocess } from "svelte-preprocess";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel"; // browser compatibility
import terser from "@rollup/plugin-terser"; // code minification
import typescript from "@rollup/plugin-typescript"; // typescript support
import css from "rollup-plugin-css-only"; // gather css in one file

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = spawn("npm", ["run", "start", "--", "--dev"], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true,
      });

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default {
  input: "src/main.ts",
  output: {
    sourcemap: !production,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        sourcemap: !production,
      }),
    }),
    css({
      output: "bundle.css",
    }),
    resolve({
      browser: true,
      dedupe: ["svelte"],
      exportConditions: ["svelte"],
    }),
    commonjs(),
    babel({
      babelHelpers: "bundled",
    }),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),

    !production && serve(),

    production && terser(),
  ],
};
