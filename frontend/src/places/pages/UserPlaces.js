import React from "react";
import { useParams } from "react-router-dom";


import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "The Manor",
    description: "The house, before it was built...",
    imageURL:
      "https://geo3.ggpht.com/cbk?panoid=BX8ZnmgBQbRy8XD4-0-qLw&output=thumbnail&cb_client=search.gws-prod.gps&thumb=2&w=408&h=240&yaw=93.37958&pitch=0&thumbfov=100",
    address: "5019 Manor Stone Ln.",
    location: {
      lat: 29.5099105,
      lng: -95.8001341
    },
    creator: "u1"
  },
  {
    id: "p2",
    title: "Flatiron",
    description: "Miss it.",
    imageURL:
      "https://lh5.googleusercontent.com/p/AF1QipOMim5bmXED53yBrsSTqGwgOIzg_jdHMgUSvx6y=w408-h272-k-no",
    address: "807 Main St.",
    location: {
      lat: 29.7589609,
      lng: -95.363447
    },
    creator: "u2"
  }
];

const UserPlaces = props => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId)
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
