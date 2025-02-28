'use client'
import Form from "next/form";

export default function Login() {
  return (
    <Form action="/dashboard">
      <label htmlFor="username">Username</label>
      <input name="username" required />

      <label htmlFor="password">Password</label>
      <input name="password" required />

      <button onClick={()=>{console.log('clicked')}} id="button" type="submit">Submit</button>
    </Form>
  );
}
