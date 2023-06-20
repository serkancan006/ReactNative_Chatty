import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Button, Subheading, Title } from "react-native-paper";
import firebase from "firebase/compat";

export default function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setName(user?.displayName ?? "");
      setEmail(user?.email ?? "");
    });
  }, []);

  return (
    <View style={{ alignItems: "center", marginTop: 16 }}>
      <Avatar.Text
        label={name.split(" ").reduce((prev, current) => prev + current[0], "")}
      />
      <Title>{name}</Title>
      <Subheading>{email}</Subheading>
      <Button onPress={() => firebase.auth().signOut()}>Sign Out</Button>
    </View>
  );
}
