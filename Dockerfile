FROM node

WORKDIR /webapp

COPY ./app /webapp/app

COPY ./test-network /webapp/test-network/

WORKDIR /webapp/app

RUN npm install

CMD [ "sh", "-c", "DEBUG=myapp:* npm start" ]
