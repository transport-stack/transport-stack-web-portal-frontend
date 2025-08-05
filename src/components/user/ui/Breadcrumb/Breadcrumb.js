import { useMatches, useLoaderData } from "react-router-dom";
import { useState } from "react";
import "./Breadcrumb.scss";
function Breadcrumb() {
  let matches = useMatches();
  let responseData = useLoaderData();
  const [data] = useState(responseData ? responseData.data : '');
  let crumbs = matches
    // first get rid of any matches that don't have handle and crumb
    .filter((match) => Boolean(match.handle?.crumb))
    // now map them into an array of elements, passing the loader
    // data to each one
    .map((match) => match.handle.crumb(match.data));

  return (
    <ul className="breadcrumb">
      {crumbs.map((crumb, index) => {
        return <li key={crumb}>{crumb}</li>;
      })}
    </ul>
  );
}

export default Breadcrumb;
