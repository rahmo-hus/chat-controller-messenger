export default class JwtModel {

    constructor(username, password, certificate) {
        this.username = username;
        this.password = password;
        this.certificate = certificate;
    }
}