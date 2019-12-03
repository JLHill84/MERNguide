import React from "react";
import { NavLink } from "react-router-dom";

import "./NavLinks.css";

const NavLinks = props => {
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>MOAR USERS!</NavLink>
      </li>
      <li>
        <NavLink to="/u1/places">MY PLACES!</NavLink>
      </li>
      <li>
        <NavLink to="/places/new">ADD MOAR PLACES!</NavLink>
      </li>
      <li>
        <NavLink to="/auth">AUTHENTICATE MEOW!</NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;
