import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Cookies from "js-cookie";

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const fullname = event.target.fullname.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        const data = {
            fullname: fullname,
            email: email,
            password: password
        };

        fetch('https://task-ojt.onrender.com/users/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
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
        <div className="flex w-[940px] container mx-auto  min-h-screen bg-white px-6 md:px-16 gap-x-24">
            {/* Form */}
            <div className="flex w-full md:w-[45%] items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="w-full max-w-md">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">
                            Sign up
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
                    </div>

                    <div className="mt-6">
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">Or sign up with</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                            <div>
                                <label htmlFor="fullname" className="block font-medium text-gray-900 mb-1">
                                    Full Name
                                </label>
                                <input
                                    id="fullname"
                                    name="fullname"
                                    placeholder="Enter your full name..."
                                    required
                                    autoComplete="email"
                                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#B8B8B8]"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block font-medium text-gray-900 mb-1">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your personal or work email..."
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
                                            <AiOutlineEye className="w-7 h-7 text-[#B8B8B8] cursor-pointer hover:bg-[#f5f5f5] p-0.5 rounded-[5px]" />
                                        ) : (
                                            <AiOutlineEyeInvisible className="w-7 h-7 text-[#B8B8B8] cursor-pointer hover:bg-[#f5f5f5] p-0.5 rounded-[5px]" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full cursor-pointer rounded-md bg-[#dc4c3e] px-4 py-3 text-[18px] font-[700] text-white shadow-sm hover:bg-[#c3392c] focus:outline-none focus:ring-2 focus:ring-red-600"
                            >
                                Sign up with Email
                            </button>
                        </form>

                        <p className="mt-[18px] pt-[18px] border-t border-[#F5F5F5] border-solid text-center text-[13px] text-[#202020] font-[400]">
                            Already signed up?{" "}
                            <Link
                                to="/users/login"
                                className="text-[#dc4c3e] hover:text-[#c3392c] underline"
                            >
                                Go to login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side image */}
            <div className="hidden md:flex md:w-[55%] items-center justify-center pl-10 relative">
                <div className="w-full aspect-ratio mb-[150px]">
                    <img
                        src="https://todoist.b-cdn.net/assets/images/7b55dafbc1fe203bd537c738fb1757ed.png"
                        alt="Sign up illustration"
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
                <div className="absolute p-[24px] text-[#282f30] rounded-[8px] bg-[#fff] w-[300px] top-[500px] left-[220px] register">
                    <p className="text-[18px] italic font-[450]">
                        Before Todoist, my to-do lists were scattered all around! Now, everything is in order and in one place.
                    </p>
                    <p className="mt-[30px] block text-[14px]">– Matt M.</p>
                </div>
            </div>
        </div>
    );
}
