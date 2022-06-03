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
               sh 'pwd'
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
        stage('Test') {
      steps {
        sh 'ng test --browsers ChromeHeadless'
        sleep(time: 90, unit: 'SECONDS')
      }
    }

    stage('SonarQube Analysis') {
      environment {
        sonarHome = 'sonar-scanner'
        JAVA_HOME = 'openjdk-11'
      }
      steps {
        withSonarQubeEnv('sonarqube') {
          sh "${sonarHome}/bin/sonar-scanner"
        }

      }
    }

    stage('Quality Gate') {
      steps {
        waitForQualityGate true
        echo '--- QualityGate Passed ---'
      }
    }
    
    stage('Deploy') {
      parallel {
        stage('Deploy Dev') {
          when {
            branch 'dev'
          }
          steps {
            dir('dev'){
              withCredentials(bindings: [azureServicePrincipal('AzureServicePrincipal')]) {
                sh 'az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID'
                sh 'az webapp deployment source config-zip -g $RESOURCE_GROUP -n $APP_NAME --src '+"${ENV_DEV}"+'.zip'
              }
            }
          }
        }

        stage('Deploy Prod') {
          steps {
            sleep(time: 30, unit: 'SECONDS')
            dir('prod'){
              withCredentials(bindings: [azureServicePrincipal('AzureServicePrincipal')]) {
                sh 'az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID'
                sh 'az webapp deployment source config-zip -g $RESOURCE_GROUP -n $APP_NAME --src '+"${ENV_PROD}"+'.zip'
              }
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
