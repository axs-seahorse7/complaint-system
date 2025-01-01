/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./views/**/*.ejs",
      "./public/**/*.js",
      './public/**/*.html',
      './views/**/*.js',
      './routes/**/*js'
    ],
  theme: {
    extend: {
      screens :{
        'max-480':{max:'480px'},
        'max-360':{max:'360px'}
      }
    },
  },
  plugins: [],
  addUtilities: {
    '.scrollbar-hidden': {
      '-ms-overflow-style': 'none', /* IE */
      'scrollbar-width': 'none', /* Firefox */
    },
    '.scrollbar-hidden::-webkit-scrollbar': {
      display: 'none', /* WebKit */
    }
  }
}

