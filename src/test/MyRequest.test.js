import { render, screen } from "@testing-library/react";
import MySubscriptionAndRequestBase from "../pages/user/account/MySubscriptionAndRequestBase";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

test("My Requests", async () => {
  const { container } = render(
    <MemoryRouter initialEntries={["/account/myrequests"]}>
      <MySubscriptionAndRequestBase />
    </MemoryRouter>
  );
  const productCard = container.querySelector(".product-card");
  expect(productCard).toBeInTheDocument();
  await userEvent.click(productCard);
  const renewSubscriptionButton = screen.getByText(/Request form details/i);
  expect(renewSubscriptionButton).toBeInTheDocument();
});
