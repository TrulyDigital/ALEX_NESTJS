FROM ubuntu:22.04

RUN apt update && \
    apt install -y curl openjdk-8-jre && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt install -y nodejs && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
ENV PATH="$JAVA_HOME/bin:${PATH}"
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", "dist/main.js"]