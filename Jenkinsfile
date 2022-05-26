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
            sh 'ng build --configuration development'
            zip(zipFile: 'app-angular-dev.zip', dir: "${env.WORKSPACE}"+'/dist/app-angular')
          }
        }

        stage('Build Prod') {
          steps {
            sh 'ng build --configuration production'
            zip(zipFile: 'app-angular-prod.zip', dir: "${env.WORKSPACE}"+'/dist/app-angular')
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
            withCredentials(bindings: [azureServicePrincipal('AzureServicePrincipal')]) {
              sh 'az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID'
              sh 'az webapp deployment source config-zip -g $RESOURCE_GROUP -n $APP_NAME --src ./app-angular-dev.zip'
            }

          }
        }

        stage('Deploy Prod') {
          steps {
            echo 'deploy a prod'
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
