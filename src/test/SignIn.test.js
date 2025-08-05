import { render,screen } from "@testing-library/react";
import SignIn from "../pages/user/SignIn";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../redux/store";

test("enter signin form and click on signin", () => {
  const submit = jest.fn();
  render(
    <Provider store={store}>
    <MemoryRouter>
      <SignIn />
    </MemoryRouter>
    </Provider>
  );
  const emailField = screen.getByLabelText(/Enter your registered Email ID/i);
  const pwdField = screen.getByLabelText(/Enter password/i);
  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  expect(emailField).toBeInTheDocument();
  expect(pwdField).toBeInTheDocument();
  expect(signInButton).toBeInTheDocument();
  userEvent.type(emailField, "asra@gmail.com");
  userEvent.type(pwdField, "pwd123");
  userEvent.click(signInButton);
  expect(submit).toHaveBeenCalledWith({
    // type: "auth/userLoginRequest",
    // payload: {
         "email": "asra@gmail.com",
          "password": "pwd123" 
        // },
  });
});
