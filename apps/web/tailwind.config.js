/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{html,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'prenda-primary': '#93935d',
                'prenda-primary-dark': '#4c5a3f',
                'prenda-primary-light': '#e6e6db',
                'prenda-dark': '#0b1d1b',
                'prenda-grey': '#e0e0e0',
                'prenda-secondary': '#a59331',
                'prenda-secondary-light': '#e7b874',
                'prenda-bg': '#ffffff',
                'prenda-olive': '#93935d',
            },
            fontFamily: {
                serif: ['"EB Garamond"', 'serif'],
                sans: ['"Inter"', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
