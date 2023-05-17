import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import axios from "axios";
import Header from "../components/Reusable/header";
import Input from "../components/Reusable/input";
import TextLink from "../components/Reusable/text-link";
import Button from "../components/Reusable/button";
import Title from "../components/Reusable/title";
import Loader from "../components/Reusable/loader";

export default function SignUp() {
  const Navigation = useNavigation();

  const [signUpDetails, setSignUpDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Basic Validation of form inputs
  const handleError = (error, input) => {
    setErrors((errors) => ({ ...errors, [input]: error }));
  };

  const validate = async () => {
    let isValid = true;
    if (!signUpDetails.email) {
      handleError("Please input an email", "email");
      isValid = false;
    }
    if (!signUpDetails.first_name) {
      handleError("Please input your first name", "first_name");
      isValid = false;
    }
    if (!signUpDetails.last_name) {
      handleError("Please input your last name", "last_name");
      isValid = false;
    }
    if (!signUpDetails.password) {
      handleError("Please input a password", "password");
      isValid = false;
    }

    if (isValid) {
      postSignUp();
    }
  };

  // post request for signing up
  async function postSignUp() {
    console.log(signUpDetails);
    setLoading(true);

    // hit signup end point with POST method
    const response = await axios
      .post("http://localhost:3333/api/1.0.0/user", signUpDetails)
      .catch((error) => {
        if (error.response) {
          /* The request was made and the server responded with a status code
          that falls out of the range of 2xx */
          console.log(error.response.status);
          console.log(error.response.data);
        } else if (error.request) {
          /* The request was made but no response was received
          `error.request` is an instance of XMLHttpRequest in the browser
          and an instance of http.ClientRequest in node.js */
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      });

    // log data response
    console.log(response.data);

    if (response.status === 201) {
      console.log("Signing up...");
      setTimeout(() => {
        setLoading(false);
        Navigation.navigate("Confirmation");
      }, 1500);
    }
  }

  return (
    <View>
      <Loader visible={loading} loadingMessage={"Signing you up"} />
      <Header subTitle="Hello there!" />

      <ScrollView style={styles.form}>
        <Title title={"Sign up"} />

        <Input
          label={"First Name"}
          iconName={"account-outline"}
          placeholder={"Enter your first name"}
          onChangeText={(first_name) =>
            setSignUpDetails({ ...signUpDetails, first_name: first_name })
          }
          error={errors.first_name}
          onFocus={() => setErrors({ ...errors, first_name: null })}
        />

        <Input
          label={"Last Name"}
          iconName={"account-outline"}
          placeholder={"Enter your last name"}
          onChangeText={(last_name) =>
            setSignUpDetails({ ...signUpDetails, last_name: last_name })
          }
          error={errors.last_name}
          onFocus={() => setErrors({ ...errors, last_name: null })}
        />

        <Input
          label={"Email"}
          iconName={"email-outline"}
          placeholder={"Enter your email address"}
          onChangeText={(email) =>
            setSignUpDetails({ ...signUpDetails, email: email })
          }
          error={errors.email}
          onFocus={() => setErrors({ ...errors, email: null })}
        />

        <Input
          label={"Password"}
          iconName={"lock-outline"}
          placeholder={"Enter your password"}
          password
          onChangeText={(password) =>
            setSignUpDetails({ ...signUpDetails, password: password })
          }
          error={errors.password}
          onFocus={() => setErrors({ ...errors, password: null })}
        />

        <Button title={"Sign up"} onPress={validate} />

        <TextLink
          text={"Already got an account? "}
          linkText={"Sign in"}
          onPress={() => Navigation.navigate("sign-in")}
        />
      </ScrollView>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 24,
  },
  form: {
    margin: 30,
  },
});
