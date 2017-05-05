FROM alpine:3.5
RUN apk update
RUN apk add nodejs ca-certificates openssl
RUN update-ca-certificates 
RUN mkdir -p /opt/
RUN cd /opt/ && \
		wget https://github.com/m-mizutani/msgdump/archive/master.zip && \
		unzip master.zip && \
		rm master.zip
WORKDIR /opt/msgdump-master
RUN npm install

ENV PORT 80
ENV MSG_PORT 24224
EXPOSE 80 24244
ENTRYPOINT npm start
