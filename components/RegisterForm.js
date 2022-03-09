import formStyle from "../styles/Form.module.css";
import { signIn} from "next-auth/react"
import { useRouter } from "next/router";
import { useState } from "react";
const RegisterForm = ({providers}) => {
    const router = useRouter();
    const [userCredentials, setUserCredentials] = useState({
        fullName:"",
		email: "",
		password: "",
        confirmPassword: "",
	});
    const { fullName, email, password, confirmPassword } =
		userCredentials;
    const handleChange = (e) => {
		const { name, value } = e.target;

		setUserCredentials({ ...userCredentials, [name]: value });
	};
    const registerUser = async event =>{
        event.preventDefault();
        if (password !== confirmPassword) {
			alert("Password don't match!");
			return;
		}
        try{
            console.log(`Email ${email}, Password ${password}`)
                    const res = await fetch('api/user/register', {
                        body: JSON.stringify({
                            name: fullName,
                            email: email,
                            password: password
                        }),
                        headers:{
                            "content-Type": "application/json"
                        },
                        method: "POST"
                    })
                    console.log(res);
                    try{
                        const result = await res.json()
                        console.log(result)
                    }catch(err){
                        console.log("Error")
                    }
                    
              
                
            
            
            
            //console.log(result)
            
    
            try {
                console.log("Here")
                const result = await signIn("credentials", {
                    redirect: false,
                    email: email,
                    password: event.target.password.value,
                });
    
                console.log("Result:" + result);
    

                    if (!result.error) {
                        router.replace("/home");
                    }
                
                
            } catch (error) {
                //Display error message
                //console.log(error);
            }
        }catch(err){
            console.log(err)
        }

        
    
    }
  return (
    <div className={formStyle.wrapper}>
        {Object.values(providers).filter(provider =>provider.name != "Credentials").map((provider) =>(
                <div className={formStyle.formGroup} key ={provider.name}>
                    <button onClick={() => signIn(provider.id, {callbackUrl: "/home"})}>
                        Register with {provider.name}
                    </button>
                </div>
        ))}
        <form className={formStyle.form} onSubmit={registerUser}>
            <div className={formStyle.innerForm}>
                <h2>REGISTER</h2>
                <div className={formStyle.formGroup}>
                    <label htmlFor="name">Name:</label>
                    <input
					className="input"
					type="text"
					placeholder="Full Name"
					required
					value={fullName}
					onChange={handleChange}
					name="fullName"
				/>
                </div>
            
                <div className={formStyle.formGroup}>
                    <label htmlFor="email">Email:</label>
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
                <div className={formStyle.formGroup}>
                    <label htmlFor="password">Password:</label>
                    <input
					className="input"
					type="password"
					placeholder="Password"
					value={password}
					name="password"
					onChange={handleChange}
					required
				/>
                </div>
                <div className={formStyle.formGroup}>
                    <label htmlFor="password">Confirm Password:</label>
                    <input
					className="input"
					type="password"
					placeholder="Confirm Password"
					value={confirmPassword}
					name="confirmPassword"
					onChange={handleChange}
					required
				/>
                </div>
                <input type="submit" value="REGISTER" />
            </div>
        </form>
    </div>
  )
}

export default RegisterForm