'use client'
import Form from "next/form";
import Image from "next/image";
import styles from "./../signup/signup.module.css";
import logo from "./../../../public/logo/logo.png";

export default function Login() {
  return (
    <Form className={styles.form} action="/dashboard">
      <Image
          className={styles.logo}
          src={logo}
          alt="Logo"
          height={40}
          layout="intrinsic"
      />
      <label className={styles.inputFields} htmlFor="username">Username</label>
      <input className={styles.input} name="username" required />

      <label className={styles.inputFields} htmlFor="password">Password</label>
      <input className={styles.input} type="password" name="password" required />

      <div className={styles.accountLink}>
        <p>Need an account?</p>
        <a href="./signup">Sign up</a>
      </div>

      <button onClick={()=>{console.log('clicked')}} id="button" type="submit" className={styles.button}>Submit</button>
    </Form>
  );
}