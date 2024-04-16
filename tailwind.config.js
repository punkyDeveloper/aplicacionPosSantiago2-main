/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['/static/**/*.css', '/static/styles/**/*.css', './frontend/views/**/*.ejs',
    './backend/routr/**/*.js', './backend/controller/**/*.js', './backend/models/**/*.js'],
  theme: {
    colors: {
      Pizarra: '#020617',
      white: '#FFFFFF',
      indigo: '#4f46e5'
    },
    textColor: {
      indigo: '#5a67d8',
      gray: '',
      white: '#FFFFFF'
    },
    extend: {}
  },
  plugins: []
};
