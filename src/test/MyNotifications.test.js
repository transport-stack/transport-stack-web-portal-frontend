import { render, screen } from "@testing-library/react";
import MyNotifications from "../pages/user/account/MyNotifications";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

test("My Notifications", async () => {
  render(
    <MemoryRouter initialEntries={["/account/mynotifications"]}>
      <MyNotifications />
    </MemoryRouter>
  );
  // Find the checkbox using getByRole
  const checkbox = screen.getByRole("checkbox");

  // Initially, the checkbox should  be checked
  expect(checkbox).toBeChecked();
  // what needs to be tested here
  screen.debug();
  // Click the checkbox
//   act(()=>{
//     userEvent.click(checkbox);
//   })
 


  // Now, the checkbox should not be checked
//  expect(checkbox).not.toBeChecked();

});
