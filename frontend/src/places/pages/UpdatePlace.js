import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";

import "./PlaceForm.css";

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

const UpdatePlace = () => {
  const [isLoading, setIsLoading] = useState(true);
  const placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false
      },
      description: {
        value: "",
        isValid: false
      }
    },
    false
  );

  const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

  useEffect(() => {
    if (identifiedPlace) {
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true
          },
          description: {
            value: identifiedPlace.description,
            isValid: true
          }
        },
        true
      );
    }

    setIsLoading(false);
  }, [setFormData, identifiedPlace]);

  const placeUpdateSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Couldn't find the place you're looking for...</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading</h2>
      </div>
    );
  }

  return (
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Enter valid title!!"
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />

      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(4)]}
        errorText="Enter valid description!!"
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE THE PLACE FRIEND
      </Button>
    </form>
  );
};

export default UpdatePlace;
