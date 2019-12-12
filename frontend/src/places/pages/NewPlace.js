import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "../../shared/util/validators";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceForm.css";

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { error, clearError, isLoading, sendRequest } = useHttpClient();
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
    },
    image: {
      value: null,
      isValid: false
    }
  });

  const history = useHistory();

  const placeSubmitHandler = async event => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places`,
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token
        }
      );
      history.push("/");
    } catch (error) {
      //Errors handled in http-hook
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="title:"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="title required"
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="description:"
          validators={[VALIDATOR_MINLENGTH(4)]}
          errorText="needs description with at least 4 characters..."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="address:"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="please input correct address"
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          // errorText="please select an image"
        />
        <Button type="submit" disabled={!formState.isValid}>
          add place
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
