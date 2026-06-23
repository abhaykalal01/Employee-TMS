import { loginUser } from "@/actions/authActions";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">

            <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700">

                <h2 className="text-4xl font-bold text-center text-white mb-8">
                    Login
                </h2>

                <form
                    action={loginUser}
                    className="space-y-5"
                >

                    <div>
                        <label className="block text-gray-300 mb-2 font-medium">
                            Email
                        </label>

                        <input
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2 font-medium">
                            Password
                        </label>

                        <input
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
                    >
                        Login
                    </button>

                </form>

            </div>

        </div>
    );
}