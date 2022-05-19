FROM timbru31/node-chrome:14-slim

#Install @angular/Cli

RUN mkdir /usr/src/app
WORKDIR /usr/src/app
RUN npm install -g @angular/cli

#Install Azure-Cli
RUN apt-get update && apt-get install -y \
    curl zip 
CMD /bin/bash

RUN curl -sL https://aka.ms/InstallAzureCLIDeb | bash

RUN groupadd --gid $USER_GID nonroot \
    && useradd --uid 1000 --gid 1000 -m $USER_GID 

USER nonroot
