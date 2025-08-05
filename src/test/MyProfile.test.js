import { render } from "@testing-library/react";
import MyProfile  from "../pages/user/account/MyProfile";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../redux/store";

test("my profile form submission", () => {
  render(
      
      <Provider store={store}>
      <MemoryRouter>
        <MyProfile />
      </MemoryRouter>
      </Provider>
  );
});
