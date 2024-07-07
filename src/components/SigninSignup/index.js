import React, { useState } from "react";
import "./style.css";
import Input from "../input";
import Button from "../Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "react-toastify";
import { auth, db, provider } from "../../firebase";
import { signInWithPopup} from "firebase/auth";
// import { GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function SigninSignupComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();
  // const [error, setError] = useState("");

  function signupWithEmail() {
    console.log("Name: ", name);
    console.log("Email: ", email);
    console.log("Password: ", password);
    console.log("Confirm Password: ", confirmPassword);

    // Authenticating the user and create a account with email and password
    setLoading(true);
    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      confirmPassword !== ""
    ) {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("User -> ", user);
            toast.success("User Created");
            setLoading(false);
            setConfirmPassword("");
            setEmail("");
            setName("");
            setPassword("");
            // Create a doc with user id as following id
            createDoc(user);
            navigate("/dashboard");
          })
          .catch((error) => {
            // const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
          });
      } else {
        toast.error("Password and Confirm Password do not match");
        setLoading(false);
      }
    } else {
      toast.error("All fields are mandatory");
      setLoading(false);
    }
  }
  function loginWithEmail() {
    // console.log("Email", email);
    // console.log("Password", password);

    setLoading(true);
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          toast.success("User Logged In");
          console.log("User logged in", user);
          navigate("/dashboard");
          setLoading(false);
          createDoc(user); // it give error as doc already exists
          // ...
        })
        .catch((error) => {
          // const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
        });
    } else {
      toast.error("All fields are mandatory");
      setLoading(false);
    }
  }
  async function createDoc(user) {
    // doc with uid doesn't exist
    // create a doc
    setLoading(true);
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc Created");
        setLoading(false);
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      toast.error("Doc already exists");
      setLoading(false);
    }
  }

  function googleAuth() {
    setLoading(true);

    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          // const credential = GoogleAuthProvider.credentialFromResult(result);
          // const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log("User--> ", user);
          createDoc(user);
          toast.success("User Authenticated");
          navigate("/dashboard");
          setLoading(false);
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          // const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
          // // The email of the user's account used.
          // const email = error.customData.email;
          // // The AuthCredential type that was used.
          // const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    } catch (e) {
      toast.error(e.message);
      setLoading(false)
    }
  }
  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Log In on <span style={{ color: "var(--theme)" }}>FinClarity</span>
          </h2>

          <form>
            <Input style = {{width:"90%"}}
              type={"email"}
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"abc@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"abc1234"}
            />

            <Button
              disabled={loading}
              text={loading ? "Loading" : "Login using Email and Password"}
              onClick={loginWithEmail}
            />
            <p className="p-login"> OR </p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading" : "Login using Google"}
              blue={true}
            />
            <p
              className="p-login"
              onClick={() => setLoginForm(!loginForm)}
              style={{ cursor: "pointer" }}
            >
              {" "}
              Don't have an account? Click Here{" "}
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on <span style={{ color: "var(--theme)" }}>FinClarity</span>
          </h2>

          <form>
            <Input
              label={"Full Name"}
              state={name}
              setState={setName}
              placeholder={"Rajat Singh"}
            />
            <Input
              type={"email"}
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"abc@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"abc1234"}
            />
            <Input
              type="password"
              label={"Confirm Password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"abc1234"}
            />

            <Button
              disabled={loading}
              text={loading ? "Loading" : "Sign Up using Email and Password"}
              onClick={signupWithEmail}
            />
            <p className="p-signup"> OR </p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading" : "Sign Up using Google"}
              blue={true}
            />
            <p
              className="p-signup"
              onClick={() => setLoginForm(!loginForm)}
              style={{ cursor: "pointer" }}
            >
              {" "}
              Already have an account? Click Here{" "}
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SigninSignupComponent;
