import React, { useContext, useState, useCallback } from "react";
import { debounce } from "lodash";
import { AccountContext } from "../providers/AccountContext";
import { AppContext } from "../providers/AppContext";
import { CommonDataContext } from "../providers/CommonDataContext";
import { validatePassword } from "../validator/PasswordValidator";

export default function SignupContainer(props) {
  const { SignupWithPassword, loginWithPassword } = useContext(AccountContext);
  const { connections } = useContext(CommonDataContext);
  const { setWhichPage } = useContext(AppContext);
  const [loader, setLoader] = useState(false);

  const [isValid, setIsValid] = useState(false);
  const [passwordRules, setPasswordRules] = useState(null);
  const [SignupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    isSubmitting: false,
  });
  const [PasswordPolicyState, setPasswordPolicyState] = useState({
    No_more_than_2_identical_characters_in_a_row: false,
    Special_characters: false,
    Lower_case_Upper_Case_Numbers: false,
    Length_Check: false,
    Non_empty_Password_Required: false,
  });
  const [SignupError, setSignupError] = useState({
    email: "",
    isEmailError: "",
    databaseError: "",
    errorCode: "",
  });

  const debounceSubmit = useCallback(
    debounce(() => {
      setSignupForm({
        ...SignupForm,
        isSubmitting: false,
      });
      setIsValid(false);
    }, 2000),
    []
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setSignupForm({
      ...SignupForm,
      isSubmitting: true,
    });
    setLoader(true);
    try {
      const res = await SignupWithPassword(
        SignupForm.email,
        SignupForm.password
      );
      if (res.email) {
        await loginWithPassword(SignupForm.email, SignupForm.password);
      }
    } catch (e) {
      if (e.code === "invalid_signup") {
        setWhichPage("login-page");
      } else {
        setSignupError({
          ...SignupError,
          databaseError: e.description,
          errorCode: e.code,
        });
      }
    }
    setLoader(false);
    debounceSubmit();
  };

  const onClick = (e) => {
    setPasswordRules(connections[0]);
  };
  const onChange = (e) => {
    if (e.target.name === "password" && passwordRules) {
      validatePassword(
        passwordRules,
        e.target.value,
        PasswordPolicyState,
        setPasswordPolicyState,
        setIsValid
      );
    }
    setSignupForm({
      ...SignupForm,
      [e.target.name]: e.target.value,
    });
  };

  const child = React.Children.only(props.children);
  return React.cloneElement(child, {
    onSubmit,
    SignupForm,
    onChange,
    onClick,
    passwordRules,
    PasswordPolicyState,
    isValid,
    SignupError,
    loader,
  });
}
