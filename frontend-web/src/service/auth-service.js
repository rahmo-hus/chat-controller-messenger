import axios from 'axios';
import JwtModel from "../model/jwt-model";
import authHeader from "./AuthConstructorService";

const API_URL = process.env.NODE_ENV === "development" ? 'http://localhost:9292/' : "http://35.181.44.216:9090/api/";

class AuthService {

    authenticate(username, password) {
        const toSend = new JwtModel(username, password);
        return axios.post(API_URL + "auth", toSend, null)
    }

    createGroup(groupName) {
        return axios.post(API_URL + "create", {name: groupName}, {headers: authHeader()})
    }

    fetchUserInformation() {
        return axios.post(API_URL + "fetch", null, {headers: authHeader()})
    }

    fetchMessages(id) {
        return axios.post(API_URL + "fetchMessages", {id: id}, {headers: authHeader()})
    }

    addUserToGroup(userId, groupUrl) {
        return axios.get(API_URL + "api/user/add/" + userId + "/" + groupUrl, {headers: authHeader()})
    }

    fetchAllUsers() {
        return axios.get(API_URL + "api/users/all", {headers: authHeader()})
    }


    fetchAllUsersInConversation(groupId) {
        return axios.post(API_URL + "api/users/group/all", {groupId: groupId}, {headers: authHeader()})
    }

    testRoute() {
        return axios.get(API_URL, {headers: authHeader()})
    }

    createUser(firstname, lastname, email, password) {
        return axios.post(API_URL + "api/user/register", {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password
        })
    }
}

export default new AuthService();