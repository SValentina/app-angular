pipeline {
  
  agent { dockerfile { args '--privileged --network=host' } }
  //options { skipDefaultCheckout() } 
  
  stages {
    stage('Checkout'){
        steps{
          dir('dev'){ 
            checkout scm 
          }
          dir('prod'){ 
            checkout scm 
          }
        }
    }

    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build') {
      parallel {
        stage('Build Dev') {
          environment{
            TITLE = 'dev'
            BUTTON = 'success'
          }
          steps {
            dir ('dev'){               
               contentReplace(configs: [fileContentReplaceConfig(configs: [fileContentReplaceItemConfig(replace: "${TITLE}", search: '%TITLE%'), fileContentReplaceItemConfig(replace: "${BUTTON}", search: '%BUTTON%')], fileEncoding: 'UTF-8', filePath: "${env.WORKSPACE}"+'/dev/src/environments/environment.ts')])
               sh 'ng build --configuration ${ENV_DEV}'
               zip(zipFile: "${ENV_DEV}"+'.zip', dir: "${env.WORKSPACE}"+'/dev/dist/app-angular')
            }
          }
        }

        stage('Build Prod') {
          environment{
              TITLE = 'prod'
              BUTTON = 'danger'
          }
          steps {
            dir('prod'){
              contentReplace(configs: [fileContentReplaceConfig(configs: [fileContentReplaceItemConfig(replace: "${TITLE}", search: '%TITLE%|dev'), fileContentReplaceItemConfig(replace: "${BUTTON}", search: '%BUTTON%|success')], fileEncoding: 'UTF-8', filePath: "${env.WORKSPACE}"+'/prod/src/environments/environment.ts')])
              sh 'ng build --configuration ${ENV_PROD}'
              zip(zipFile: "${ENV_PROD}"+'.zip', dir: "${env.WORKSPACE}"+'/prod/dist/app-angular')
            }
          }
        }
      }
    }
      
    stage('Deploy') {
      parallel {
        stage('Deploy Dev') {
          steps {
            dir('dev'){
              sh 'dev'
            }
          }
        }

        stage('Deploy Prod') {
          steps {            
            dir('prod'){
              sh 'docker version'
              sh "echo 'FROM nginx:1.17.1-alpine \nCOPY dist/app-angular /usr/share/nginx/html' > Dockerfile"
            }
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
