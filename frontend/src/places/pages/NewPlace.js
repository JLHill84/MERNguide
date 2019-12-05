import React from "react";

import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import "./PlaceForm.css";

const NewPlace = () => {
  const [formState, inputHandler] = useForm({
    title: {
      value: "",
      isValid: false
    },
    description: {
      value: "",
      isValid: false
    },
    address: {
      value: "",
      isValid: false
    }
  });

  const placeSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please pick a real title :P"
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(4)]}
        errorText="Please pick a real title with at least 4 characters..."
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="input"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Need real address :("
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        ADD NEW PLACE FRIEND
      </Button>
    </form>
  );
};

export default NewPlace;
