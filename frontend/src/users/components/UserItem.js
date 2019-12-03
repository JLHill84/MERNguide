import React from "react";
import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import { Link } from "react-router-dom";

import "./UserItem.css";

const UserItem = props => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
          <Link to={`/${props.id}/places`}>
            <div className="user-item__image">
              <Avatar image={props.image} alt={props.name} />
            </div>
            <div className="user-item__info">
              <h2>{props.name}</h2>
              <h4>
                {props.placeCount} {props.placeCount === 1 ? "Place" : "Places"}
              </h4>
            </div>
          </Link>
      </Card>
    </li>
  );
};

export default UserItem;
