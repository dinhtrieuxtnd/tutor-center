import type { Config } from "tailwindcss"

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",      // 👈 thêm nếu bạn để code trong src/
        "./app/**/*.{js,ts,jsx,tsx,mdx}",      // cho app directory
        "./components/**/*.{js,ts,jsx,tsx,mdx}" // cho components
    ],
    theme: {
        extend: {
            colors: {
                primary: "#194DB6", // 👈 màu chủ đạo
            },
        },
    },
    plugins: [],
}

export default config
