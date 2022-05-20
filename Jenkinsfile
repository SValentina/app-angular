pipeline {
  agent {
    docker {
      image 'valen97/node-chrome-angular:azure-cli'
      args '--network=host'
    }

  }
  stages {
    stage('Sonar Scanner') {
        environment{
            sonarHome = tool 'sonar-scanner'
            JAVA_HOME = tool 'openjdk-11'
        }
        steps{
            withSonarQubeEnv('sonarqube'){
                sh "${sonarHome}/bin/sonar-scanner -e -Dsonar.login=36c87f6ba08fca14f6555e990caa5681b3b16fde -Dsonar.projectName=calculator-angular -Dsonar.projectVersion=${env.BUILD_NUMBER} -Dsonar.projectKey=Calculator -Dsonar.sources=src/app"
            }
        }
    }

    stage('Install') {
      steps {
        sh 'npm config set fetch-retry-mintimeout 20000'
        sh 'npm config set fetch-retry-maxtimeout 120000'
        sh 'npm config rm proxy'
        sh 'npm config rm https-proxy'
        sh 'npm install'
      }
    }

    stage('Build') {
      steps {
        sh 'ng build'
        zip(zipFile: 'app-angular.zip', dir: "${env.WORKSPACE}"+'/dist/app-angular')
      }
    }
    
    stage('Test') {
      steps {
        sh 'ng test --browsers ChromeHeadless'
      }
    }
    
    stage('Deploy Dev') {
      when {
        branch 'dev'
      }
      steps {
        withCredentials(bindings: [azureServicePrincipal('AZURE_CREDENTIAL_ID')]) {
          sh 'az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID'
          sh 'az webapp deployment source config-zip -g $RESOURCE_GROUP -n $APP_NAME --src ./app-angular.zip'
        }
      }
    }
  }
  parameters {
    string(name: 'RESOURCE_GROUP', defaultValue: 'SOCIUSRGLAB-RG-MODELODEVOPS-DEV', description: 'Grupo de Recursos')
    string(name: 'APP_NAME', defaultValue: 'sociuswebapptest007', description: 'Nombre de App Service')
  }
}
