pipeline {
  agent any

  stages {

    stage('build') {
      steps {
        git 'https://github.com/Arun12415/devops-ai.git'
      }
    }

    stage('SonarQube Scan') {
      steps {
        echo 'Scanning code...'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t devops-ai .'
      }
    }

    stage('Run Container') {
      steps {
        sh 'docker run -d -p 3000:3000 devops-ai'
      }
    }
  }
}
