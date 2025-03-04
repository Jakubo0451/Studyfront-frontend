"use client";
import Form from "next/form";

export default function page() {
  return (
    <div>
      <Form action="/dashboard">
        <label htmlFor="username">Username</label>
        <input name="username" required />

        <label htmlFor="email">Email</label>
        <input name="email" required />

        <label htmlFor="password">Password</label>
        <input type="password"  name="password" required />

        <label htmlFor="password-repeat">Repeat Password</label>
        <input type="password" name="password-repeat" required />

        <button onClick={()=>{console.log('clicked')}} id="button" type="submit">Submit</button>
        
        <p>Already have an account?</p>
        <a href="./login">Log in!</a>
      </Form>
    </div>
  );
}
