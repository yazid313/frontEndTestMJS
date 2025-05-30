"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "nextjs-toploader/app";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import InputData from "@/components/form/inputData";
import { EditDataSkeleton } from "@/components/skeleton/skeletonAdmin";

export default function AddProfile({ params }) {
  const router = useRouter();
  const { slug } = React.use(params);
  const [isLoading, setIsLoading] = useState(slug === "edit" ? true : false);
  const [loadingButton, setLoadingButton] = useState(false);

  const onSubmit = async (e) => {
    const createDataUser = {
      firstname: formik.values.firstname,
      lastname: formik.values.lastname,
      birthdate: formik.values.birthdate,
    };

    try {
      if (formik.values.id) {
        setLoadingButton(true);

        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/user/updateUser/${formik.values.id}`,
          createDataUser
        );
        if (response.status == 200) {
          const createDataAddress = {
            user_id: response.data.id,
            street: formik.values.street,
            city: formik.values.city,
            province: formik.values.province,
            postal_code: formik.values.postal_code,
          };
          try {
            const response = await axios.put(
              `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/address/updateAddress/${formik.values.address_id}`,
              createDataAddress
            );
            router.push(`/`);
            localStorage.removeItem("user_id");
            localStorage.setItem("newData", "updated successfully!");
          } catch (error) {
            console.error(error);
            setLoadingButton(false);
          }
        }
      } else {
        setLoadingButton(true);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/user/createUser`,
          createDataUser
        );

        if (response.status == 201) {
          const createDataAddress = {
            user_id: response.data.id,
            street: formik.values.street,
            city: formik.values.city,
            province: formik.values.province,
            postal_code: formik.values.postal_code,
          };
          try {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/address/createAddress`,
              createDataAddress
            );

            localStorage.setItem("newData", "created successfully!");
            router.push(`/`);
          } catch (error) {
            console.error(error);
            setLoadingButton(false);
          }
        }
      }
    } catch (error) {
      console.error(error);
      setLoadingButton(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      id: "",
      firstname: "",
      lastname: "",
      birthdate: "",
      address_id: "",
      street: "",
      city: "",
      province: "",
      postal_code: "",
    },
    onSubmit,
    validationSchema: yup.object().shape({
      id: yup.string().notRequired(),
      firstname: yup.string().required(),
      lastname: yup.string().required(),
      birthdate: yup.date().required(),
      address_id: yup.string().notRequired(),
      street: yup.string().required(),
      city: yup.string().required(),
      province: yup.string().required(),
      postal_code: yup.string().required(),
    }),
  });

  //CARI DATA BERDASARKAN ID KETIKA EDIT
  useEffect(() => {
    if (slug === "edit") {
      setIsLoading(true);
      const fetchData = async () => {
        const token = localStorage.getItem("token");
        try {
          const userId = localStorage.getItem("user_id");

          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/user/getUserJoinAddresById/${userId}`
          );

          const data = response.data;

          formik.setValues({
            id: data.id,
            firstname: data.firstname,
            lastname: data.lastname,
            birthdate: data.birthdate,
            address_id: data.Address.id,
            street: data.Address.street,
            city: data.Address.city,
            province: data.Address.province,
            postal_code: data.Address.postal_code,
          });
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, []);

  const handleCancel = () => {
    router.push("/");
    localStorage.removeItem("user_id");
  };

  // Handler untuk perubahan nilai input
  const handleChange = (e) => {
    const { target } = e;
    formik.setFieldValue(target.name, target.value);
  };

  return (
    <div className="p-8 pt-20 w-full">
      <div className="">
        <h2 className="text-xl font-nunito">Manage Users</h2>

        {isLoading ? (
          <EditDataSkeleton />
        ) : (
          <form
            className="mt-4 border p-8 grid gap-4"
            onSubmit={formik.handleSubmit}
          >
            <InputData
              label="First Name :"
              id="firstname"
              placeholder="first name"
              name="firstname"
              type="text"
              value={formik.values.firstname}
              onChange={handleChange}
              errorMessage={formik.errors.firstname}
              isError={
                formik.touched.firstname && formik.errors.firstname
                  ? true
                  : false
              }
            />
            <InputData
              label="Last Name :"
              id="lastname"
              placeholder="last name"
              name="lastname"
              type="text"
              value={formik.values.lastname}
              onChange={handleChange}
              errorMessage={formik.errors.lastname}
              isError={
                formik.touched.lastname && formik.errors.lastname ? true : false
              }
            />

            <div className="mb-4">
              <label htmlFor="birthdate" className="block font-medium mb-1">
                Birth Date:
              </label>
              <DatePicker
                id="birthdate"
                name="birthdate"
                selected={formik.values.birthdate}
                onChange={(date) => formik.setFieldValue("birthdate", date)}
                dateFormat="dd-MM-yyyy"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                className={`w-full rounded-[8px] p-2 border ${
                  formik.touched.birthdate && formik.errors.birthdate
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholderText="Select birth date"
              />
              {formik.touched.birthdate && formik.errors.birthdate && (
                <p className="text-sm text-red-500">
                  {formik.errors.birthdate}
                </p>
              )}
            </div>
            <InputData
              label="Street :"
              id="street"
              placeholder="street"
              name="street"
              type="text"
              value={formik.values.street}
              onChange={handleChange}
              errorMessage={formik.errors.street}
              isError={
                formik.touched.street && formik.errors.street ? true : false
              }
            />
            <InputData
              label="City :"
              id="city"
              placeholder="city"
              name="city"
              type="text"
              value={formik.values.city}
              onChange={handleChange}
              errorMessage={formik.errors.city}
              isError={formik.touched.city && formik.errors.city ? true : false}
            />
            <InputData
              label="Province :"
              id="province"
              placeholder="province"
              name="province"
              type="text"
              value={formik.values.province}
              onChange={handleChange}
              errorMessage={formik.errors.province}
              isError={
                formik.touched.province && formik.errors.province ? true : false
              }
            />
            <InputData
              label="Postal Code :"
              id="postal_code"
              placeholder="postal code"
              name="postal_code"
              type="text"
              value={formik.values.postal_code}
              onChange={handleChange}
              errorMessage={formik.errors.postal_code}
              isError={
                formik.touched.postal_code && formik.errors.postal_code
                  ? true
                  : false
              }
            />

            <div className="flex gap-8 text-white justify-end">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                disabled={loadingButton}
              >
                {loadingButton ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Submit"
                )}
              </Button>

              <Button
                type="button"
                onClick={handleCancel}
                className="cursor-pointer hover:bg-red-700"
                variant="destructive"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
