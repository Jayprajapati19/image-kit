import mongoose from "mongoose";

const MOGODB_URI = process.env.MONGODB_URI!;

if (!MOGODB_URI) {
    throw new Error("check your database connection string");
}


let cached = global.mongoose;


if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    }
}


export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10
        };
        cached.promise = mongoose
            .connect(MOGODB_URI, opts).then(() => mongoose.connection)
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
    }

    return cached.conn;
}
