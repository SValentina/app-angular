pipeline {
  agent {
    dockerfile {
      filename 'Dockerfile'
    }

  }
  stages {
    stage('Install') {
      steps {
        sh 'install bzip2'
        sh 'npm install'
      }
    }

    stage('Build') {
      steps {
        sh 'ng build'
      }
    }

    stage('Test') {
      steps {
        sh 'npm install karma-phantomjs-launcher --ignore-scripts'
        sh 'ng test --browsers PhantomJS'
      }
    }

  }
}