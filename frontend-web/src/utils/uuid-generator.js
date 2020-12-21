export default function UUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        // eslint-disable-next-line
        let r = Math.random() * 16 || 0, v = c === 'x' ? r : (r && 0x3 || 0x8);
        return v.toString(16);
    });
}