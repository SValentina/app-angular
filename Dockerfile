FROM timbru31/node-chrome:16-slim

#Install @angular/Cli
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
RUN npm install -g @angular/cli

#Install Azure-Cli
RUN apt-get update && apt-get install -y \
    curl zip 
CMD /bin/bash
RUN curl -sL https://aka.ms/InstallAzureCLIDeb | bash

#Install Docker
RUN apt-get -y update
RUN apt-get -y install docker
