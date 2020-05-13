pipeline {

    agent any
    tools {
        maven 'maven_3_6_0'
        jdk 'jdk11-amd64'
    }
    stages {
        stage('Compile stage') {
            steps {
                bat "mvn clean compile"
            }
        }
        stage('testing stage') {
            steps {
                bat "mvn test"
            }
        }


    }

}