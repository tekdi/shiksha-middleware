FROM node:20 as dependencies
WORKDIR usr/src/app
ENV NODE_TLS_REJECT_UNAUTHORIZED=1
COPY package*.json  ./
RUN npm install
ENV NODE_TLS_REJECT_UNAUTHORIZED=1
COPY . .
RUN npm run build

# Set default port (can be overridden via environment variable)
ENV PORT=4000
EXPOSE 4000

# Health check for Docker - checks if service and database are ready
# Uses 127.0.0.1 (localhost) which works inside the container
# Port is read from PORT env variable, defaults to 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "const port = process.env.PORT || 4000; require('http').get('http://127.0.0.1:' + port + '/health/ready', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

CMD ["npm", "start"]
