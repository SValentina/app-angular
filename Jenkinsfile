pipeline {
  agent {
    dockerfile {
      args '--privileged --network=host'
    }

  }
  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build') {
      parallel {
        stage('Build Dev') {
          steps {
            dir("${WORKSPACE}/src/environments"){
                sh 'pwd'
                prependToFile(file: 'environment.jenkins.ts', content: 'export const environment = {   production: false,   title:\'dev\' };')
            }
            sh 'ng build --configuration ${ENV_DEV}'
            zip(zipFile: "${ENV_DEV}"+'.zip', dir: "${env.WORKSPACE}"+'/dist/app-angular')
          }
        }

        stage('Build Prod') {
          steps {
            dir("${WORKSPACE}/src/environments"){
                sh 'pwd'
                prependToFile(file: 'environment.jenkins.ts', content: 'export const environment = {   production: true,   title:\'prod\' };')
            }
            sh 'ng build --configuration ${ENV_PROD}'
            zip(zipFile: "${ENV_PROD}"+'.zip', dir: "${env.WORKSPACE}"+'/dist/app-angular')
          }
        }
      }
    }
    
    stage('Deploy') {
      parallel {
        stage('Deploy Dev') {
          when {
            branch 'dev'
          }
          steps {
            withCredentials(bindings: [azureServicePrincipal('AzureServicePrincipal')]) {
              sh 'az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID'
              sh 'az webapp deployment source config-zip -g $RESOURCE_GROUP -n $APP_NAME --src'+"${ENV_DEV}"+'.zip'
            }
          }
        }

        stage('Deploy Prod') {
          steps {
            sleep(time: 30, unit: 'SECONDS')
            withCredentials(bindings: [azureServicePrincipal('AzureServicePrincipal')]) {
              sh 'az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID'
              sh 'az webapp deployment source config-zip -g $RESOURCE_GROUP -n $APP_NAME --src'+"${ENV_DEV}"+'.zip'
            }
          }
        }
      }

  }
  parameters {
    string(name: 'ENV_PROD', defaultValue: 'production', description: 'Nombre del entorno de producción')
    string(name: 'ENV_DEV', defaultValue: 'development', description: 'Nombre del entorno de desarrollo')
    string(name: 'RESOURCE_GROUP', defaultValue: 'SOCIUSRGLAB-RG-MODELODEVOPS-DEV', description: 'Grupo de Recursos')
    string(name: 'APP_NAME', defaultValue: 'sociuswebapptest007', description: 'Nombre de App Service')
  }
}
