FROM node:14-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN ls -la /app

FROM httpd:alpine

RUN apk add --no-cache \
    curl \          
    wget \          
    vim \           
    bash \          
    net-tools \     
    alpine-sdk      

RUN rm -rf /usr/local/apache2/conf/httpd.conf

COPY --from=build /app/build /usr/local/apache2/htdocs/
COPY --from=build /app/.htaccess /usr/local/apache2/htdocs/
COPY --from=build /app/httpd.conf /usr/local/apache2/conf/


EXPOSE 80

CMD ["httpd-foreground"]
