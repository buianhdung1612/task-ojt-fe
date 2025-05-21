import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Illustration from "../../assets/images/login-bg.png";
import Cookies from "js-cookie";

export const LoginPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        fetch('https://task-ojt.onrender.com/users/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.code == "success") {
                    Cookies.set("token", data.token, { expires: 7 });
                    navigate("/today");
                }
            })
    }

    return (
        <div className="flex w-[940px] container mx-auto min-h-screen bg-white px-6 md:px-16 gap-x-24">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center py-12">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                        Log in
                    </h2>

                    <button
                        type="button"
                        className="btn-google cursor-pointer w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-100"
                    >
                        <img
                            src="https://img.icons8.com/color/24/google-logo.png"
                            alt="Google logo"
                            className="w-5 h-5"
                        />
                        Continue with Google
                    </button>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-base">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 text-base">
                        <div>
                            <label htmlFor="email" className="block font-medium text-gray-900 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email..."
                                required
                                autoComplete="email"
                                className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#B8B8B8]"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label htmlFor="password" className="font-medium text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password..."
                                    required
                                    autoComplete="current-password"
                                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 pr-12 focus:outline-none focus:border-[#B8B8B8]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="btn-google absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
                                >
                                    {showPassword ? (
                                        <AiOutlineEye className="w-7 h-7 cursor-pointer text-[#B8B8B8] hover:bg-[#f5f5f5] p-0.5 rounded-[5px]" />
                                    ) : (
                                        <AiOutlineEyeInvisible className="w-7 h-7 cursor-pointer text-[#B8B8B8] hover:bg-[#f5f5f5] p-0.5 rounded-[5px]" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full cursor-pointer rounded-md bg-[#dc4c3e] px-4 py-3 text-[18px] font-[700] text-white shadow-sm hover:bg-[#c3392c] focus:outline-none focus:ring-2 focus:ring-red-600"
                        >
                            Log in
                        </button>
                    </form>

                    <Link className="text-[#dc4c3e] hover:text-[#c3392c] underline text-[13px] font-[400] block mt-[10px] mb-[20px]">Forgot your password?</Link>

                    <p className="pt-[18px] border-t border-[#F5F5F5] border-solid text-center text-[13px] text-[#202020] font-[400]">
                        Don’t have an account?{" "}
                        <Link
                            to="/users/register"
                            className="text-[#dc4c3e] hover:text-[#c3392c] underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            <div className="hidden md:flex md:w-1/2 items-center justify-center">
                <img
                    src={Illustration}
                    alt="Illustration"
                    className="max-w-[450px] w-full h-auto object-contain"
                />
            </div>
        </div>
    );
}
