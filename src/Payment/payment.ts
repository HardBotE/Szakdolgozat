import  {NextFunction,Request,Response} from "express";
import SessionModel from "../Model/sessionModel";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const payment= async function (req: Request, res: Response,next: NextFunction) {

    try{
        const price:number= req.body.price ||200;

        if(!price || price<0){
            return next(new Error("Please enter a valid price"));
        }

        const session=await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items:[
                {
                    price_data:{
                        currency:"USD",
                        product_data:{
                            name:'payment'
                        },
                        unit_amount:price
                    },
                    quantity:1
                }
            ],
            mode:'payment',
            success_url:'http://SUCCESS_TODO',
            cancel_url:'http://FAIL_TODO'

        });
        res.status(200).json({
            success:'success',
            session
        })
    }
    catch(err){
        res.status(404).json({
            success:"failed",

        })
    }

};

const checkPayment = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const sessionId = req.body.sessionId as string;

        if (!sessionId) {
            return next(new Error("Session ID is required"));
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {

            await updateDatabaseAfterPayment(req.params.id);

            return res.status(200).json({
                success: true,
                message: "Payment completed successfully",
                session,
            });
        }

        res.status(200).json({
            success: false,
            message: "Payment is not completed yet",
            session,
        });
    } catch (err) {
        next(err);
    }
};

async function updateDatabaseAfterPayment(sessionId: string) {
    console.log(`Updating database for successful payment: ${sessionId}`);

    await SessionModel.findByIdAndUpdate(sessionId, {status:"paid"});

}


export {payment,checkPayment};