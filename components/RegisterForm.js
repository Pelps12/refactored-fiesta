import formStyle from "../styles/Form.module.css";
import { signIn } from "next-auth/react"
import { useRouter } from "next/router";
import { useState } from "react";
const RegisterForm = ({ providers }) => {
    const router = useRouter();
    const [userCredentials, setUserCredentials] = useState({
        fullName: "",
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
    const registerUser = async event => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Password don't match!");
            return;
        }
        try {

            const res = await fetch('api/user/register', {
                body: JSON.stringify({
                    name: fullName,
                    email: email,
                    password: password
                }),
                headers: {
                    "content-Type": "application/json"
                },
                method: "POST"
            })
            console.log(res);
            try {
                const result = await res.json()
                console.log(result)
            } catch (err) {
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
        } catch (err) {
            console.log(err)
        }



    }
    return (
        <div className={formStyle.wrapper}>
            <div className={formStyle.imageBox}>

            </div>
            <div className={formStyle.content}>
                <div className={formStyle.formBox}>
                    <form onSubmit={registerUser}>
                        <h2>REGISTER</h2>
                        <div className={formStyle.inputBox}>
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

                        <div className={formStyle.inputBox}>
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
                        <div className={formStyle.inputBox}>
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
                        <div className={formStyle.inputBox}>
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
                        <div className={formStyle.inputBox}>
                            <input type="submit" value="REGISTER" />

                        </div>

                    </form>
                    
                    {Object.values(providers).filter(provider => provider.name != "Credentials").map((provider) => (
                        
                            <div className="container mx-auto" key={provider.name}>
                                <button className={`rounded-md content-center px-2 py-3 my-2 ${provider.id === "facebook"? "bg-[#1778F2] text-white": "bg-slate-200 text-black"}`} onClick={() => signIn(provider.id, { callbackUrl: "/home" })}>
                                    Register with {provider.name}
                                </button>
                            </div>
                        

                    ))}
                </div>

            </div>

        </div>
    )
}

export default RegisterForm