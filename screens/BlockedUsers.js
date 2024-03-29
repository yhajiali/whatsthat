import { FlatList, StyleSheet, View } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoContactsImage from "../assets/images/no_contacts.png";
// Components
import ContactListItem from "../components/Contacts/contact-list-item";
import EmptyTemplate from "../components/Reusable/empty-template";
// Authenticator
import AuthenticateUser from "../navigation/main-authentication";

const BlockedUsers = () => {
  const Navigation = useNavigation();
  const [blockedUsers, setBlockedUsers] = useState("");

  useEffect(() => {
    AuthenticateUser(Navigation);
    Navigation.setOptions({
      headerShown: true,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      getBlockedUser();
    }, [])
  );

  const getBlockedUser = async () => {
    const userToken = JSON.parse(await AsyncStorage.getItem("@session_token"));

    await axios
      .get("http://localhost:3333/api/1.0.0/blocked", {
        headers: {
          "X-Authorization": userToken,
        },
      })
      .then((response) => {
        // check if user has anyone blocked (if array length of data returned > 0)
        if (response.data.length > 0) {
          console.log(`Status: ${response.status} ~ Getting Blocked Users...`);
          setBlockedUsers(response.data);
        } else {
          setBlockedUsers("");
          console.log("No Blocked Users...");
        }
      })
      .catch((error) => {
        console.log(
          `Status: ${error.response.status} ~ ${error.response.data}`
        );
      });
  };

  return blockedUsers ? (
    <View style={styles.container}>
      <FlatList
        data={blockedUsers}
        renderItem={({ item }) => (
          <ContactListItem contact={item} isBlocked blockedPage />
        )}
      />
    </View>
  ) : (
    // If the user has noone blocked yet... render empty template message showing that
    <EmptyTemplate
      image={NoContactsImage}
      text={"You have no blocked users"}
      onPressFunction={() => Navigation.navigate("Search")}
    />
  );
};

export default BlockedUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
});
