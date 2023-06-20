import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import {
  Avatar,
  List,
  Divider,
  FAB,
  Portal,
  Dialog,
  Button,
  TextInput,
} from "react-native-paper";
import firebase from "firebase/compat";
import { useNavigation } from "@react-navigation/core";

export default function ChatList() {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [useEmail, setuseEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setEmail(user?.email ?? "");
    });
  }, []);

  const navigation = useNavigation();

  const createChat = async () => {
    if (!email || !useEmail) return;
    setIsLoading(true);
    const responce = await firebase
      .firestore()
      .collection("chats")
      .add({
        users: [email, useEmail],
      });
    setIsLoading(false);
    setIsDialogVisible(false);
    navigation.navigate("Chat", { chatId: responce.id });
  };

  const [chats, setChats] = useState([]);
  useEffect(() => {
    return firebase
      .firestore()
      .collection("chats")
      .where("users", "array-contains", email)
      .onSnapshot((querySnapshot) => {
        //console.warn(querySnapshot.docs.map((x) => x.data().users));
        setChats(querySnapshot.docs);
      });
  }, [email]);

  return (
    <View style={{ flex: 1 }}>
      {chats.map((chat) => (
        <React.Fragment>
          <List.Item
            title={chat.data().users.find((x) => x !== email)}
            description={(chat.data().messages ?? [])[0]?.text ?? undefined}
            left={() => (
              <Avatar.Text
                label={chat
                  .data()
                  .users.find((x) => x !== email)
                  .split(" ")
                  .reduce((prev, current) => prev + current[0], "")}
                size={56}
              />
            )}
            onPress={() => navigation.navigate("Chat", { chatId: chat.id })}
          />
          <Divider inset />
        </React.Fragment>
      ))}

      <Portal>
        <Dialog
          visible={isDialogVisible}
          onDismiss={() => setIsDialogVisible(false)}
        >
          <Dialog.Title>New Chat</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Enter user email"
              value={useEmail}
              onChangeText={(text) => setuseEmail(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => createChat()} loading={isLoading}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <FAB
        icon="plus"
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          backgroundColor: "#e91e63",
          borderRadius: 50,
        }}
        onPress={() => setIsDialogVisible(true)}
        color="white"
      />
    </View>
  );
}
