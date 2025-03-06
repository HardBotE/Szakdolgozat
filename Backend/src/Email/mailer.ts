import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import {Email} from "../Types/user.type";
dotenv.config();

const transporter=nodemailer.createTransport({
    host:process.env.MAILTRAP_HOST,
    port:Number(process.env.MAILTRAP_PORT),
    secure:false,
    auth:{
        user:process.env.MAILTRAP_USERNAME,
        pass:process.env.MAILTRAP_PASSWORD,
    }
});

const sendEmail=async function (sender:Email, receiver:Email, subject:string,message:string) {
    try {
    const email= await transporter.sendMail({
        from:`${sender.name}  <${sender.email}>`,
        to:`${receiver.email}`,
        subject:`${subject}`,
        text:message,
        html:`
            <h1>Welcome ${receiver.name}!</h1>
            <b>${message}</b>`
    });
    console.log('Email sent');}
         catch(err){
             console.log(err);
         }
}
export default sendEmail;