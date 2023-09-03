import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert"
import ReservationForm from "./ReservationForm";
require("dotenv").config();

//API URL configuration that has been set in configuration file
const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5001"

function NewReservation() {
    const history = useHistory();
    //sets default value of form data to empty strings
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    });

    //errors are null by default
    const [error, setError] = useState(null);

    function handleChange(target) {
        const updatedFormData = {
            ...formData,
            [target.name]: target.value,
        };

        //sets form data if no errors occur
        setFormData(updatedFormData);
    }

    async function handleSubmit(event) {
        //sets variable for errors as empty array
        const newErrors = [];

        //if attempting to make res for less than 1 person, pushes error message
        if(formData.people < 1) {
            newErrors.push("Please enter a number of people.")
        }
        //if there are any errors, sets error state message to newErrors array
        if(formData.people < 1) {
            setError({ message: newErrors})

            return;
        } else {
            //creates abort controller to prevent crashes
            const abortController = new AbortController();
            const signal = abortController.signal;
            //ensures people type is a number
            formData.people = Number(formData.people);

            try{
                //attempts port request to API
                await axios.post(
                    `${API_BASE_URL}/reservations`,
                    {
                        data: formData,
                    },
                    //signal abort controller if cancellation is necessary
                    { signal }
                );
                //if post request is successful, redirects to dashboard, which lists all res for "reservation_date"
                history.push(`dashboard?date=${formData.reservation_date}`);
              //if error is not intentional cancellation, error message is obtained from response  
            } catch (error) {
                if (error.name !== "AbortError") {
                    setError({ message: error.response.data.error });
                }
            }
            //cleanup function
            return () => abortController.abort();
        }
    }

    //when cancel button is clicked, browser redirected to previous page
    const handleCancel = () => {
        history.goBack();
    };

    return (
        <div>
            <h1>New Reservation</h1>
            <ReservationForm
                initialFormData={formData}
                submitHandler={handleSubmit}
                cancelHandler={handleCancel}
                changeHandler={handleChange}
            />
            <ErrorAlert error={error} />
        </div>
    );
}

export default NewReservation;
