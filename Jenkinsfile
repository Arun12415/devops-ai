pipeline {
  agent any

  environment {
    OPENAI_API_KEY = credentials('openai-key')
  }

  stages {

    stage('Build') {
      steps {
        git branch: 'main',
            url: 'https://github.com/Arun12415/devops-ai.git'
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
        sh 'docker run -d -p 3000:3000 -e OPENAI_API_KEY=$OPENAI_API_KEY devops-ai'
      }
    }
  }
}
