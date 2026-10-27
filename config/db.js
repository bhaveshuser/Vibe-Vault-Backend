import mongoose from "mongoose";
const ConnectDB = async() =>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`Host is:${conn.connection.host}`)
        console.log("MongoDB Connected Successfully");
    }catch(error)
    {
        console.log(console.error)
    }
}
export default ConnectDB