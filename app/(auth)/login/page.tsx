export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f3d2e] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1f5f46] via-[#0d3b2e] to-[#021b14]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* Left Section */}
        <div className="text-white max-w-lg">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Making zero <br />
            waste <span className="text-green-400">a reality.</span>
          </h1>

          <p className="mt-6 text-gray-300 text-lg leading-relaxed">
            Join thousands of households turning everyday scraps into
            sustainable impact through intelligent tracking.
          </p>

          <div className="mt-10 flex items-center gap-3">
            <div className="w-12 h-[2px] bg-green-400"></div>
            <span className="text-green-400 uppercase tracking-[4px] text-xs font-semibold">
              Sustainability Simplified
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
          
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#0f3d2e] flex items-center justify-center text-white font-bold">
              ♻
            </div>
            <span className="font-bold text-[#0f3d2e] text-lg">
              BinBuddy
            </span>
          </div>

          <h2 className="text-3xl font-bold text-[#0f3d2e]">
            Welcome back
          </h2>

          <p className="text-gray-500 mt-2 mb-8">
            Log in to manage your sustainable impact.
          </p>

          <form className="space-y-5">
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>

              <input
                type="email"
                placeholder="xyz@gmail.com"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-black placeholder-gray-400"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>

                <button
                  type="button"
                  className="text-sm text-green-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <input
                type="password"
                placeholder="••••••"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-black placeholder-gray-400"
              />
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2">
              <input type="checkbox" className="accent-green-600" />
              <span className="text-sm text-gray-600">
                Remember me
              </span>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-[#0f3d2e] hover:bg-[#14513e] transition text-white font-semibold py-3 rounded-xl"
            >
              Sign in to Dashboard →
            </button>
          </form>

          {/* Signup */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="text-green-600 font-semibold hover:underline"
            >
              signup
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
