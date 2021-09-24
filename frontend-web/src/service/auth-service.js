import axios from 'axios';
import JwtModel from "../model/jwt-model";

const API_URL = process.env.NODE_ENV === "development" ? 'http://localhost:9090/api/' : "https://"+window.location.hostname+"/api/";
const instance = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

class AuthService {

    authenticate(username, password, certificate) {
        const toSend = new JwtModel(username, password, certificate);
        return instance.post("auth-one", toSend);
    }

    verify(username, verificationCode){
        return instance.post("verify", {
            username: username,
            verificationCode: verificationCode
        });
    }

    testRoute() {
        return instance.get("fetch");
    }

    logout() {
        return instance.get("logout");
    }

    createGroup(groupName) {
        return instance.post("create", {name: groupName})
    }

    fetchMessages(id) {
        return instance.post(API_URL + "fetchMessages", {id: id})
    }

    addUserToGroup(userId, groupUrl) {
        return instance.get(API_URL + "user/add/" + userId + "/" + groupUrl)
    }

    fetchAllUsers() {
        return instance.get(API_URL + "users/all")
    }

    fetchAllUsersInConversation(groupId) {
        return instance.post(API_URL + "users/group/all", {groupUrl: groupId})
    }

    createUser(firstname, lastname, email, password) {
        return instance.post(API_URL + "user/register", {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password
        })
    }

    leaveConversation(userIdToRemove, groupId) {
        return instance.get(API_URL + "user/leave/" + userIdToRemove + "/group/" + groupId);
    }

    removeUserFromConversation(userIdToRemove, groupId) {
        return instance.get(API_URL + "user/remove/" + userIdToRemove + "/group/" + groupId);
    }

    removeAdminUserInConversation(userIdToRemove, groupId) {
        return instance.get(API_URL + "user/remove/admin/" + userIdToRemove + "/group/" + groupId);
    }

    grantUserAdminInConversation(userIdToRemove, groupId) {
        return instance.get(API_URL + "user/grant/" + userIdToRemove + "/group/" + groupId);
    }
}

export default new AuthService();