pipeline {
  agent {
    docker {
      image 'valen97/node-chrome-angular:azure-cli'
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
      }
    }
    
    stage('Deploy Dev') {
      when {
        branch 'dev'
      }
      steps {
        withCredentials(bindings: [azureServicePrincipal('${AZURE_ID}')]) {
          sh 'az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID'
          sh 'az webapp deployment source config-zip -g $RESOURCE_GROUP -n $APP_NAME --src ./app-angular.zip'
        }
      }
    }
  }
  parameters {
    string(name: 'RESOURCE_GROUP', defaultValue: 'SOCIUSRGLAB-RG-MODELODEVOPS-DEV', description: 'Grupo de Recursos')
    string(name: 'APP_NAME', defaultValue: 'sociuswebapptest007', description: 'Nombre de App Service')
    string(name: 'AZURE_ID', defaultValue: 'AzureServicePrincipal', description: 'Id de credenciales de Azure')
  }
}
