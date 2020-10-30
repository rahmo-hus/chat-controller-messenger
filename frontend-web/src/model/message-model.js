export default class MessageModel {
    userId;
    groupId;
    message;

    constructor(userId, groupId, message) {
        this.userId = userId;
        this.groupId = groupId;
        this.message = message;
    }
}