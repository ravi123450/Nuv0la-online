import mongoose from "mongoose";

export const connectDB = async () => {
    (await mongoose.connect("mongodb+srv://merakanapalliraviteja86:wejhTlHwGGgPMXbn@cluster0.q7okber.mongodb.net/cloud")).isObjectIdOrHexString(()=>console.log("DB Connected"));
}