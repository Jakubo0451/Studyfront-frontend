import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/app/lib/dbconnect";
import User from "@/app/models/user";

export async function POST(request){
    try {
        await dbConnect();
        const {username, email, passoword} = await request.json();
        if (!username || !email || !password) {
            return NextResponse.badRequest({message: "Missing fields"}, {status: 400});
        }
        const existingUser = await User.findONe({email});
        if (existingUser) {
            return NextResponse.conflict({message: "User already exists"}, {status: 409});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({username, email, password: hashedPassword});
        return NextResponse.created({message: "User created", user}, {status: 201});

    } catch (error) {
        console.error("Error creating user", error);
        return NextResponse.error({message: "Error creating user"}, {status: 500});
    }
}