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
      steps {
        sh 'ng build'
        zip(zipFile: 'app-angular.zip', dir: "${env.WORKSPACE}"+'/dist/app-angular')
      }
    }
    
    stage('Test') {
      steps {
        sh 'ng test --browsers ChromeHeadless'
        sleep(time: 3, unit: 'MINUTES')
      }
    }
    
    stage('SonarQube Analysis') {
        environment{
            sonarHome = tool 'sonar-scanner'
            JAVA_HOME = tool 'openjdk-11'
        }
        steps{
            withSonarQubeEnv('sonarqube'){
                sh "${sonarHome}/bin/sonar-scanner"
            }
        }
    }
    stage("Quality Gate") {
        steps {
            waitForQualityGate abortPipeline: true     
            echo '--- QualityGate Passed ---'
        }
    }
    stage('Deploy Dev') {
      when {
        branch 'dev'
      }
      steps {
        withCredentials(bindings: [azureServicePrincipal('AzureServicePrincipal')]) {
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
