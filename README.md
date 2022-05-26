# Calculadora Angular 
Repositorio que contiene una aplicación Angular, con el archivo Jenkinsfile que corresponde a la pipeline que automatiza una serie de pasos establecidos dentro de diferentes Stages (escenarios) para culminar con el despliegue de la misma en un App Service de Azure. 
Además, se realiza el análisis de calidad de código mediante la integración de Jenkins con el servidor SonarQube.

Para llevar a cabo la ejecución de la Pipeline se creó un Dockerfile a partir de una [imagen de node-chrome](https://hub.docker.com/r/timbru31/node-chrome) a la que se le añadió Angular-CLI y Azure-CLI. 

Código fuente de la aplicación Angular: https://codingdiksha.com/angular-calculator-application-source-code/

Versiones utilizadas: 
- Node.js: 16.0.0
- Angular-CLI: 13.0.0
- Chrome: 
- Azure-CLI:

## Instalación de Jenkins y SonarQube utilizando Docker
Se utilizó Docker para correr tanto el servidor Jenkins como la plataforma de SonarQube sobre contenedores, por medio del archivo docker-compose.yml. También se puede seguir la instalación de la [documentación oficial de Jenkins](https://www.jenkins.io/doc/book/installing/docker/).

Se almacena el `docker-compose.yml` en un directorio, y dentro del mismo la primera vez se ejecuta por terminal `docker-compose up -d`. Luego `docker-compose start` para iniciar los servicios que var a ser accesibles desde: `http://localhost:8080` (Jenkins) y `http://localhost:9000/` (SonarQube) o la IP utilizada. 

Comandos a utilizar: 
- `docker-compose start|stop|restart`: Para iniciar/finalizar/reiniciar ambos servicios 
- `docker-compose start|stop|restart <nombre_servicio>`: Para iniciar/finalizar/reiniciar un servicio en particular.
- `docker-compose logs -f <nombre_servicio>`: Para ver los logs del servicio
- `docker exec -it jenkins bash`: Para ejecutar la terminal dentro del contenedor de Jenkins. 

La imagen que se utilizó para Jenkins fue ... Y la imagen utilizada para SonarQube es la última, ya que versiones anteriores (incluida la versión LTS) no poseen soporte de Node.js. 

### docker-compose.yml

```
version: '3.8'
services:
    jenkins:
        image: jenkins/docker
        build:
            context: dockerjenkins
        ports:
            - 8080:8080
            - 50000:50000
        container_name: jenkins
        volumes:
            - $PWD/jenkins_home:/var/jenkins_home
            - /var/run/docker.sock:/var/run/docker.sock
        networks:
            - net
    sonarqube:
        image: sonarqube:latest
        privileged: true
        ports:
            - 9000:9000
            - 9092:9092
        networks:
            - net
        environment:
            - SONAR_FORCEAUTHENTICATION=false
networks:
    net:
```
## Jenkins
### Plugins utilizados
- [Azure Credentials](https://plugins.jenkins.io/azure-credentials/): Se debe crear una credencial del tipo Azure Service Principal para poder realizar el deployment. 
- [Pipeline Utility Steps](https://plugins.jenkins.io/pipeline-utility-steps/): Se utiliza en el stage Build para comprimir los archivos resultantes. 
- [SonarQube Scanner](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner-for-jenkins/): Permite conectar Jenkins con el servidor de SonarQube. Se debe completar en la configuración global de Jenkins, en la sección **SonarQube servers** el nombre del servidor (`sonarqube`) y la URL del mismo (`http://localhost:9090`)

### Global Tools Configuration
- **JDK** 
  - Nombre: `openjdk-11`
  - :heavy_check_mark: Instalar automáticamente
  - Dirección web del archivo ejecutable: `https://download.java.net/java/GA/jdk11/13/GPL/openjdk-11.0.1_linux-x64_bin.tar.gz`
  - Directorio donde extraer el archivo: `jdk-11.0.1`
  
- **SonarQube Scanner**
  - Nombre: `sonar-scanner`
  - :heavy_check_mark: Instalar automáticamente
  - Install from Maven Central Versión: `4.7.0.2747`

## SonarQube 
Para realizar el análisis de calidad del código fuente del proyecto, se utiliza el archivo `sonar-project.properties` el cual contiene las propiedades necesarias para la ejecución del Scanner y debe ser alojado en el directorio raíz para su correcta utilización. 
### Quality Gate
Para poder utilizar la función [waitForQualityGates](https://www.jenkins.io/doc/pipeline/steps/sonar/) se necesita establecer el WebHook en SonarQube. 

Ir a **Administration** > **Webhooks** > **Create**, y completar los siguientes campos: 
- Name: `webhook-sonar`
- URL: `http://localhost:8080/sonarqube-webhook`
