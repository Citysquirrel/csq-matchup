import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import viteCompression from "vite-plugin-compression";

export default defineConfig(({ mode }) => {
	const isProd = mode === "production";
	return {
		plugins: [
			react(),
			babel({ presets: [reactCompilerPreset()] }),
			isProd &&
				viteCompression({
					algorithm: "gzip",
					ext: ".gz",
				}),
			isProd &&
				viteCompression({
					algorithm: "brotliCompress",
					ext: ".br",
				}),
		].filter(Boolean),

		esbuild: {
			exclude: isProd ? ["console", "debugger"] : [],
		},

		build: {
			sourcemap: false,

			assetsInlineLimit: 2048,

			rollupOptions: {
				output: {
					entryFileNames: "[name].[hash].js",
					chunkFileNames: "chunks/[name].[hash].js",
					assetFileNames: "assets/[name].[hash].[ext]",
					manualChunks: (id) => {
						if (id.includes("node_modules")) {
							return "vendor";
						}

						if (id.includes("data") && id.endsWith(".json")) {
							return "pokemon-db";
						}
					},
				},
			},
		},
	};
});

