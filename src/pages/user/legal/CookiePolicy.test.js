import {render,screen} from "@testing-library/react";
import CookiePolicy from "./CookiePolicy";
test("testing cookie policy",()=>{
render(<CookiePolicy/>);
const text = screen.getByRole('heading',{level:1})
expect(text).toBeInTheDocument();
expect(text).toHaveTextContent(/Cookie policy/i);
})