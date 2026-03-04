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
                script {
                    def scannerHome = tool 'Sonarqube'
                    withSonarQubeEnv('Sonarqube') {
                        sh """
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=devops-ai \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://sonarqube:9000
                        """
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:latest .'
            }
        }

        stage('Push Docker Image to DockerHub') {
            steps {
                sh '''
                docker login -u $DOCKERHUB_CREDS_USR -p $DOCKERHUB_CREDS_PSW
                docker push $IMAGE_NAME:latest
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
            emailext(
                subject: "SUCCESS: Jenkins Build ${BUILD_NUMBER}",
                body: """
Build Successful!

Job: ${JOB_NAME}
Build Number: ${BUILD_NUMBER}

Application URL:
http://localhost:3000
""",
                to: "iarunrao1.in@gmail.com"
            )
        }

        failure {
            emailext(
                subject: "FAILED: Jenkins Build ${BUILD_NUMBER}",
                body: """
Build Failed!

Job: ${JOB_NAME}
Build Number: ${BUILD_NUMBER}

Please check Jenkins logs.
""",
                to: "iarunrao1.in@gmail.com"
            )
        }
    }
}
