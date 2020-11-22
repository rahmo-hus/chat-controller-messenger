import axios from 'axios';
import JwtModel from "../model/jwt-model";
import authHeader from "./AuthConstructorService";

const API_URL = process.env.NODE_ENV === "development" ? 'http://localhost:9090/api/' : "http://192.168.1.2:9090/api/";

const instance = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

class AuthService {

    authenticate(username, password) {
        const toSend = new JwtModel(username, password);
        return instance.post("auth", toSend);
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
        return axios.post(API_URL + "fetchMessages", {id: id}, {headers: authHeader()})
    }

    addUserToGroup(userId, groupUrl) {
        return axios.get(API_URL + "user/add/" + userId + "/" + groupUrl, {headers: authHeader()})
    }

    fetchAllUsers() {
        return axios.get(API_URL + "users/all", {headers: authHeader()})
    }


    fetchAllUsersInConversation(groupId) {
        return axios.post(API_URL + "users/group/all", {groupUrl: groupId}, {headers: authHeader()})
    }

    createUser(firstname, lastname, email, password) {
        return axios.post(API_URL + "user/register", {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password
        })
    }

    removeUserFromConversation(userIdToRemove, groupId) {
        return axios.get(API_URL + "user/remove/" + userIdToRemove + "/group/" + groupId, {headers: authHeader()});
    }

    removeAdminUserInConversation(userIdToRemove, groupId) {
        return axios.get(API_URL + "user/remove/admin/" + userIdToRemove + "/group/" + groupId, {headers: authHeader()});
    }

    grantUserAdminInConversation(userIdToRemove, groupId) {
        return axios.get(API_URL + "user/grant/" + userIdToRemove + "/group/" + groupId, {headers: authHeader()});
    }

    uploadFile(data) {
        return axios.post(API_URL + "upload", data, {headers: authHeader()});
    }
}

export default new AuthService();