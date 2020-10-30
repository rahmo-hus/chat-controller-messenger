import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, Alert, Button} from 'react-native';



const ws = new WebSocket("ws://lblalbab.fr");

export default function App() {
    const [inputText, onChangeText] = React.useState("");
    return (
        <View style={styles.container}>
            <Text>{inputText}</Text>
            <View style={{
                flexDirection: 'row', width: "100%", alignSelf: 'stretch',
                textAlign: 'center'
            }}>
                <TextInput
                    style={{
                        flex: 1,
                        height: 40,
                        color: "#b3b3b3",
                        backgroundColor: "#ffffff",
                        borderColor: "#ffffff",
                        borderRadius: 5,
                        borderWidth: 1,
                        paddingLeft: 5,
                    }}
                    placeholder={"Enter you message"}
                    onChangeText={text => onChangeText(text)}
                />
                <Button
                    onPress={() => Alert.alert('Simple Button pressed THIBAUT')}
                    title={"\u27A4"}
                    color={"#007bff"}
                    accessibilityLabel={"Send message to chat"}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d4d4d4',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
