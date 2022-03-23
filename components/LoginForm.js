import formStyle from "../styles/Form.module.css";
import { useState } from "react";
import { signIn, useSession, getSession } from "next-auth/react"
import { useRouter } from "next/router";
import { MixPanelTracking } from "../util/Mixpanel";

const LoginForm = ({ providers, csrfToken }) => {
    const { data: session } = useSession();
    console.log(session);
    const router = useRouter();
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
            if(!result.ok){
                console.log(`${result.status} not authorized`)
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
          {Object.values(providers).filter(provider =>provider.name != "Credentials").map((provider) =>(
              <div className={formStyle.innerForm} key ={provider.name}>
                <div className={formStyle.formGroup} key ={provider.name}>
                    <button onClick={() => signIn(provider.id, {callbackUrl: "http://localhost:3000/home"})}>
                        Sign in with {provider.name}
                    </button>
                </div>
              </div>
          ))}

            <form onSubmit={handleSubmit} className={formStyle.formGroup}>
            <input
					className="input"
					type="email"
					placeholder="Email Address"
					required
					value={email}
					onChange={handleChange}
					name="email"
					autoComplete="email"
				/><br/>
				<input
					className="input"
					type="password"
					placeholder="Password"
					required
					value={password}
					onChange={handleChange}
					name="password"
					autoComplete="password"
				/><br/>
                <button type="submit">Sign in</button>
            </form>
            </div>

        )
          }
export default LoginForm