FROM node:20.8.0-alpine3.18

RUN addgroup -S appgroup && adduser -S -D -G appgroup appuser

USER appuser

WORKDIR /home/appuser/app

COPY --chown=appuser:appgroup package.json package-lock.json ./

RUN npm install

COPY --chown=appuser:appgroup . .

CMD ["npm", "start"]
