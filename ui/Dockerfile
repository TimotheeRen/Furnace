FROM node:20.9.0-alpine
WORKDIR /app
COPY ./.next/standalone/ .
COPY ./.next/static ./.next/static
COPY ./public ./public
EXPOSE 3000
ENTRYPOINT ["node", "server.js"]
