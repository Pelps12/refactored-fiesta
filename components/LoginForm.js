import formStyle from "../styles/Form.module.css";

const LoginForm = () => {
  return (
      <div className={formStyle.wrapper}>
          <form className={formStyle.form} action="">
              <div className={formStyle.innerForm}>
                  <h2>LOGIN</h2>
             
       <div className={formStyle.formGroup}>
           <label htmlFor="email">Email:</label>
           <input type="text" name="email" id="email" />
       </div>
       <div className={formStyle.formGroup}>
           <label htmlFor="password">Password:</label>
           <input type="text" name="password" id="password" />
       </div>
       <input type="submit" value="LOGIN" />
              </div>
   </form>
      </div>
   
  )
}

export default LoginForm