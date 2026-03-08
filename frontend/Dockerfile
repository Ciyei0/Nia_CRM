FROM node:18-alpine AS build

WORKDIR /app

RUN apk add --no-cache git

COPY package*.json ./
RUN npm install

COPY . .

# Fix for OpenSSL 3.0 error in Node 17+ (ERR_OSSL_EVP_UNSUPPORTED)
ENV NODE_OPTIONS=--openssl-legacy-provider

ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]
