pipeline {
    agent any

    environment {
        OPENAI_API_KEY = credentials('openai-key')
        DOCKERHUB_CREDS = credentials('dockercred')
        IMAGE_NAME = "arunrao12/devops-ai"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/Arun12415/devops-ai.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube-server') {
                    sh '''
                    sonar-scanner \
                    -Dsonar.projectKey=devops-ai \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://localhost:9000 \
                    -Dsonar.login=admin
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $arunrao12:latest .'
            }
        }

        stage('Push Docker Image to DockerHub') {
            steps {
                sh '''
                docker login -u $DOCKERHUB_CREDS_USR -p $DOCKERHUB_CREDS_PSW
                docker push $arunrao12:latest
                '''
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                docker stop devops-ai || true
                docker rm devops-ai || true
                docker run -d \
                --name devops-ai \
                -p 3000:3000 \
                -e OPENAI_API_KEY=$OPENAI_API_KEY \
                $IMAGE_NAME:latest
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {

        success {
            emailext (
                subject: "SUCCESS: Jenkins Build ${1}",
                body: """
Build Successful!

Job: ${Devops-ai}
Build Number: ${1}

Application URL:
http://localhost:3000
""",
                to: "iarunrao1.in@gmail.com"
            )
        }

        failure {
            emailext (
                subject: "FAILED: Jenkins Build ${1}",
                body: """
Build Failed!

Job: ${Devops-ai}
Build Number: ${1}

Please check Jenkins logs.
""",
                to: "iarunrao1.in@gmail.com"
            )
        }
    }
}
