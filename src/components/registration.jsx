/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { Form, redirect, useNavigation, useLoaderData } from "react-router-dom";
import Styles from "./form.module.css";
import { loginUser } from "./api";

// using loader to pass the message down

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const loginLoader = ({ request }) => {
  return new URL(request.url).searchParams.get("message");
};

// choosing the action function does not matter.
// the action function will intercept the request made when submitting the form

export const loginAction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const phone = formData.get("phone");

  const pathname =
    new URL(request.url).searchParams.get("redirectTo") || "/trivia";
  try {
    const data = await loginUser({ name, phone });
    localStorage.setItem("user", JSON.stringify(data));

    // const response = redirect(pathname);
    // response.body = true;
    return redirect(pathname);
  } catch (err) {
    // console.log(err.includes("Failed to fetch"));
    if (err) {
      if (err.message.phone !== "") {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          html: <i>{err.message.phone}</i>,
          icon: "error",
        });
      }

      if (err.message.name !== "") {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          html: <i>{err.message.name}</i>,
          icon: "error",
        });
      }

      if (err.message.validate === "All fields must be filled ") {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          html: <i>{err.message.validate}</i>,
          icon: "error",
        });
      }

      if (err.message.played !== "") {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          html: <i>{err.message.played}</i>,
          icon: "error",
        });
      }

      // failed to fetch
      if (
        !err.message.played &&
        !err.message.validate &&
        !err.message.name &&
        !err.message.phone
      ) {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          html: <i>Failed to fetch</i>,
          icon: "error",
        });
      }
    }
    return err.message;
  }
};

const LoginPage = () => {
  // code for logging status with useNavigation hook

  const navigation = useNavigation();
  const loginMssgError = useLoaderData();
  // const errorMessage = useActionData();


  return (
    <>
      <div className={Styles.login_container}>
        {/* below instead of using the form we wil use Form from the react router */}
        <Form className={Styles.form} method="post" replace>
          <div className="row">
            <div className="errorlgnmsg">
              {loginMssgError && (
                <div className="alert alert-danger" role="alert">
                  <p>
                    <i className="material-icons">error</i>
                  </p>
                  <p className="error_alert_message">{loginMssgError}</p>
                </div>
              )}
            </div>
          </div>
          <div className="row input-field">
            {/* <label htmlFor="name">Name</label> */}
            <input type="text" name="name" id="name" placeholder="Name" />
          </div>
          <div className="row input-field">
            {/* <label htmlFor="phone_number">Phone</label> */}
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="Phone Number"
            />
          </div>
          <div className="row input-field  button-style">
            <button
              className={Styles.button}
              disabled={navigation.state === "submitting"}
            >
              {navigation.state === "submitting" ? "registering..." : "submit"}
            </button>
          </div>

          {/* </form> */}
        </Form>
      </div>
    </>
  );
};

export default LoginPage;
