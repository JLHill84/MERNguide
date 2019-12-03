import React from "react";

import PlaceItem from "../components/PlaceItem";
import Card from "../../shared/components/UIElements/Card";
import "./PlaceList.css";

const PlaceList = props => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places yet. Make one friend!</h2>
          <button>Share a place!</button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map(place => (
        <PlaceItem
          key={place.ide}
          id={place.id}
          image={place.imageURL}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
