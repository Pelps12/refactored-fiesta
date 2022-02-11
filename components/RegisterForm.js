import formStyle from "../styles/Form.module.css";

const RegisterForm = () => {
  return (
    <div className={formStyle.wrapper}>
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