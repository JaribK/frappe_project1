/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('frappe-ui/src/utils/tailwind.config')
  ],

  prefix: 'tw-',
  content: [
    "./maechan/templates/**/*.{html,js}",
    "./**/print_format/**/*.{html,js}",
    "./maechan/public/**/*.{html,js,vue}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}

