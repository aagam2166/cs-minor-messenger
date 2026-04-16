import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import {
  registerUserRequest,
  loginRequest,
  getCurrentUserRequest
} from "../backend/auth";

import { login as authLogin } from "../app/authSlice";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const create = async (data) => {
    setError("");

    try {
      const user = await registerUserRequest(data);

      if (user) {
        const session = await loginRequest({
          email: data.email,
          password: data.password
        });

        if (session) {
          const currentUser = await getCurrentUserRequest();

          dispatch(
            authLogin({
              userData: currentUser,
              accessToken: session.accessToken
            })
          );

          navigate("/");
        }
      }
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
        <h2 className="text-center text-2xl font-bold leading-tight">
          Signup to create account
        </h2>

        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>

        {error && (
          <p className="text-red-600 mt-8 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit(create)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Full Name"
              placeholder="Enter your name"
             {...register("fullName", { required: true })}

            />
            <Input
  label="Username"
  placeholder="Choose a username"
  {...register("username", { required: true })}
/>


            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be valid",
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              {...register("password", { required: true })}
            />

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
