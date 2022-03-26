import formStyle from "../styles/Form.module.css";
import { useState } from "react";
import { signIn, useSession, getSession } from "next-auth/react"
import { useRouter } from "next/router";
import { MixPanelTracking } from "../util/Mixpanel";

const LoginForm = ({ providers, csrfToken }) => {
    const { data: session, status } = useSession();
    console.log(session);
    const router = useRouter();
    const [error, setError] = useState("");
    const [userCredentials, setUserCredentials] = useState({
        email: "",
        password: "",
    });

    const { email, password } = userCredentials;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Here")
            const result = await signIn("credentials", {
                redirect: false,
                email: email,
                password: password,
            });

            console.log("Result:" + result.status);

            if (!result.error) {
                const session = await getSession();
                console.log(session);
                MixPanelTracking.getInstance().loggedIn(session)
                MixPanelTracking.getInstance().track("logged in")
                console.log("Hello");
                router.replace("/home");
            }
            const checking = result.ok;
            console.log("HelloJohn" + checking);
            if (!result.ok) {
                setError("Your password is incorrect");
            }

        } catch (error) {
            //Display error message
            console.log(error);
        }


    }
    const handleChange = (e) => {
        const { name, value } = e.target;

        setUserCredentials({ ...userCredentials, [name]: value });
    };
    return (
        <div className={formStyle.wrapper}>

            <div className={formStyle.imageBox}>

            </div>
            <div className={formStyle.content}>
                <div className={formStyle.formBox}>
                    {/* <div>
      The user is <b>{result?.ok ? 'currently' : 'not'}</b> logged in.    </div> */}
                    <div><p>{error}</p></div>
                    <form onSubmit={handleSubmit} className={formStyle.formGroup}>
                        <h2>Login</h2>
                        <div className={formStyle.inputBox}>
                            <input
                                className="input"
                                type="email"
                                placeholder="Email Address"
                                required
                                value={email}
                                onChange={handleChange}
                                name="email"
                                autoComplete="email"
                            />
                        </div>
                        <div className={formStyle.inputBox}>
                            <input
                                className="input"
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={handleChange}
                                name="password"
                                autoComplete="password"
                            />
                        </div>
                        <div className={formStyle.inputBox}>
                            <input type="submit" value="Sign in" />
                        </div>

                    </form>
                    {Object.values(providers).filter(provider => provider.name != "Credentials").map((provider) => (
                        <div className={formStyle.innerForm} key={provider.name}>
                            <div className={formStyle.formGroup} key={provider.name}>
                                <button className={`rounded-md content-center px-2 py-3 my-2 ${provider.id === "facebook"? "bg-[#1778F2] text-white": "bg-slate-200 text-black"}`} onClick={() => signIn(provider.id, { callbackUrl: "http://localhost:3000" })}>
                                    Sign in with {provider.name}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>

    )
}
export default LoginForm