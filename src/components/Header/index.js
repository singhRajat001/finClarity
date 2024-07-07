import React, { useEffect } from "react";
import "./style.css";
// import { CollectionReference } from "firebase/firestore";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import userImg from "../../assets/user.svg";
function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  function logoutFunc() {
    try {
      // const auth = getAuth();
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          toast.success("Logged Out successfully");
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.message);
          // An error happened.
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="navbar">
      {/* <p className="navheader">FinClarity..</p> */}
      <img className="logo" src="fin.png" alt="Oops" />
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img
            style={{ height: "2em", width: "2rem", borderRadius: "50%" }}
            src={user.photoURL ? user.photoURL : userImg}
            alt=""
          />
          <img
            className="logout-icon"
            src="/logout.png" // Replace with the actual path to your logout image
            alt="w"
            onClick={logoutFunc}
          />
        </div>
      )}
    </div>
    // <div className="navbar">
    //   {/* <p className="navheader">FinClarity..</p> */}
    //   <img className="logo" src="fin.png" alt="Oops" />
    //   {user ? (
    //     <img
    //       className="logout-icon"
    //       src="/logout.png" // Replace with the actual path to your logout image
    //       alt="w"
    //       onClick={logoutFunc}
    //     />
    //   ) : null}
    // </div>
  );
}

export default Header;
