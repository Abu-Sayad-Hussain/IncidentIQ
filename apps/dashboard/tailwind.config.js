const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'src/**/*!(*.stories|*.spec).{ts,tsx,html}'),
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        background: '#0f172a',
        surface: '#1e293b',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
};
