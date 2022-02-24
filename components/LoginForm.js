import formStyle from "../styles/Form.module.css";
import { useState } from "react";
import { signIn, useSession} from "next-auth/react"
import { useRouter } from "next/router";

const LoginForm = ({providers, csrfToken}) => {
    const {data: session} = useSession();
    console.log(session);
    const router = useRouter();
    const [userCredentials, setUserCredentials] = useState({
		email: "",
		password: "",
	});

    const { email, password } = userCredentials;

    const handleSubmit = async (e) =>{
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
					router.replace("/home");
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
              <div className={formStyle.formGroup} key ={provider.name}>
                  <button onClick={() => signIn(provider.id, {callbackUrl: "/"})}>
                      Sign in with {provider.name}
                  </button>
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

        {/* <form onClick={handleSubmit} className={formStyle.form} >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <div className={formStyle.innerForm}>
                <h2>LOGIN</h2>
                    
                <div className={formStyle.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input type="text" name="email" id="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className={formStyle.formGroup}>
                    <label htmlFor="password">Password:</label>
                    <input placeholder = "password" type="text" name="password" id="password" value={password} onChange={(e) =>setPassword(e.target.value)}/>
                </div>
                <button type="submit">LOG IN</button>
            </div>
        </form> */}
      </div>
   
  )
}


export default LoginForm