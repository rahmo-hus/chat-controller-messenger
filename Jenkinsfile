pipeline {

    agent any
    tools {
        maven 'maven_3_5_0'
        jdk 'jdk1.8.0_191'
    }
    stages {
        stage('Compile stage') {
            steps {
                sh "mvn clean compile"
            }
        }

        stage('testing stage') {
            steps {
                sh "mvn test"
            }
        }

    }

}