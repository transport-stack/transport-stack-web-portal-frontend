import { render, screen } from "@testing-library/react";
import { act } from 'react';
import Settings  from "../pages/user/account/Settings";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";


test("my setting", async () => {
  render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>

  );
  const notoficationButton = screen.getByRole("button", { name: /Notifications On/i });
  expect(notoficationButton).toBeInTheDocument();
  const changePasswordButton = screen.getByRole("button", { name: /Change Password/i });
  expect(changePasswordButton).toBeInTheDocument();
  act(() => {
   userEvent.click(changePasswordButton);
  });
  const changePasswordHeader = screen.getByText(/Change Password/i);
  expect(changePasswordHeader).toBeInTheDocument();

});
