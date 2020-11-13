export const playNotificationSound = () => {
    let notificationCoolDown = 0;
    let newMessage = new Audio("/assets/sounds/new_message.mp3")
    if (notificationCoolDown === 0) {
        // console.log("No coolDown")
        newMessage.play();
    } else {
        console.log("CoolDown")
        setTimeout(() => {
            newMessage.play().then(r => {
                console.log(r);
            });
            notificationCoolDown++;
        }, 3000)
    }
}