# Calculadora Angular 

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) version 13.3.4.
Se creo
Fuente: https://codingdiksha.com/angular-calculator-application-source-code/

## Instalación de Jenkins y SonarQube utilizando Docker
Se utilizó Docker para correr tanto el servidor Jenkins como la plataforma de SonarQube sobre contenedores, por medio del archivo docker-compose.yml. También se puede seguir la instalación de la [documentación oficial de Jenkins](https://www.jenkins.io/doc/book/installing/docker/).

Se almacena el `docker-compose.yml` en un directorio, y dentro del mismo la primera vez se ejecuta por terminal `docker-compose up -d`.

Comandos a utilizar: 
- `docker-compose start|stop|restart`: Para iniciar/finalizar/reiniciar ambos servicios 
- `docker-compose start|stop|restart <nombre_servicio>`: Para iniciar/finalizar/reiniciar un servicio en particular.
- `docker-compose logs -f <nombre_servicio>`: Para ver los logs del servicio
- `docker exec -it jenkins bash`: Para ejecutar la terminal dentro del contenedor de Jenkins. 

La imagen que se utilizó para Jenkins fue ... Y la imagen utilizada para SonarQube es la versión 9.4.0 de Community Edition, ya que versiones anteriores no poseen soporte de Node.js. 

### docker-compose.yml

```
version: "3.8"
services:
    jenkins:
        image: jenkins/jenkins:lts
        privileged: true
        user: root
        ports:
            - 8080:8080 
            - 50000:50000           
        container_name: jenkins
        volumes:
            - jenkins_configuration:/var/jenkins_home
            - /var/run/docker.sock:/var/run/docker.sock
        networks:
            - mynetwork
    sonarqube:
        image: sonarqube:9.4.0-community
        privileged: true
        ports:
            - 9000:9000
        networks:
            - mynetwork
        environment:
            - SONAR_FORCEAUTHENTICATION=false
volumes: 
    jenkins_configuration:
networks:
    mynetwork:
```
## Jenkins
### Plugins utilizados
- Azure Credentials
- Pipeline Utility Steps 
- SonarQube Scanner

### Global Tools Configuration
- JDK 

### Jenkinsfile

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## SonarQube 

