import { login } from "../lib/api/auth";

async function test() {
  try {
    console.log("Attempting to connect and login to backend...");
    const res = await login({ email: "admin@binbuddy.com", password: "adminpassword" });
    console.log("Login Success response:", JSON.stringify(res));
  } catch (e: any) {
    console.error("Login Failure error:", e.message);
  }
}
test();
