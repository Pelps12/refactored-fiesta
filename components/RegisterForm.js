import formStyle from "../styles/Form.module.css";
import { signIn} from "next-auth/react"
const RegisterForm = ({providers}) => {
  return (
    <div className={formStyle.wrapper}>
        {Object.values(providers).map((provider) =>(
                <div className={formStyle.formGroup} key ={provider.name}>
                    <button onClick={() => signIn(provider.id, {callbackUrl: "/"})}>
                        Register with {provider.name}
                    </button>
                </div>
        ))}
        <form className={formStyle.form} action="">
            <div className={formStyle.innerForm}>
                <h2>REGISTER</h2>
                <div className={formStyle.formGroup}>
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" id="name" />
                </div>
            
                <div className={formStyle.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input type="text" name="email" id="email" />
                </div>
                <div className={formStyle.formGroup}>
                    <label htmlFor="password">Password:</label>
                    <input type="text" name="password" id="password" />
                </div>
                <div className={formStyle.formGroup}>
                    <label htmlFor="password">Confirm Password:</label>
                    <input type="text" name="password" id="password" />
                </div>
                <input type="submit" value="REGISTER" />
            </div>
        </form>
    </div>
  )
}

export default RegisterForm