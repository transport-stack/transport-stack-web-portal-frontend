// SignIn.test.js
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import {
  MemoryRouter,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import SignInPage from "../pages/user/SignIn.js"; // The sign-in page component
import { Provider } from "react-redux";
import store from "../redux/store.js";
import Header from "../components/user/Header.js";

  test("User clicks Sign In in home page, gets redirected to Sign In page, enters credentials, and submits", async () => {
    // Render the HomePage within the Router contexts
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Header />} />
            <Route path="/signin" element={<SignInPage />}></Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const signInButtonInHeader = screen.getByRole('button',{name:/Sign in/i});
    expect(signInButtonInHeader).toBeInTheDocument();
    //Step 1: User clicks on signin option on home page
    fireEvent.click(signInButtonInHeader);
    //Step 2: User sees signin page on screen
    await screen.getByTestId("signin");


    //assert user is redirected to homepage
  });
