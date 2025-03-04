"use client";
import Form from "next/form";
import Image from "next/image";
import styles from "./signup.module.css";
import logo from "./../../../public/logo/logo.png";

export default function page() {
  return (
    <div>
      
      <Form className={styles.form} action="/dashboard">
        <Image
          className={styles.logo}
          src={logo}
          alt="Logo"
          height={40}
          layout="intrinsic"
        />
        <label className={styles.inputFields} htmlFor="username">Username</label>
        <input className={styles.input} name="username" placeholder="Username" required />

        <label className={styles.inputFields} htmlFor="email">Email</label>
        <input className={styles.input} name="email" placeholder="Email" required />

        <label className={styles.inputFields} htmlFor="password">Password</label>
        <input className={styles.input} type="password" name="password" placeholder="Password" required />

        <label className={styles.inputFields} htmlFor="password-repeat">Repeat Password</label>
        <input className={styles.input} type="password" name="password-repeat" placeholder="Password" required />

        <div className={styles.accountLink}>
          <p>Already have an account?</p>
          <a href="./login">Log in!</a>
        </div>

        <button onClick={() => { console.log('clicked') }} id="button" type="submit" className={styles.button}>Sigh up</button>
      </Form>
    </div>
  );
}
